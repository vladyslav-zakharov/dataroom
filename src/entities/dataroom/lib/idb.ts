/**
 * IndexedDB persistence helpers.
 *
 * Uses a single database ("dataroom") with three object stores to avoid
 * the race condition that occurs when opening the same database multiple
 * times with different version requirements.
 *
 * Stores:
 *   "datarooms" → key: "list", value: Dataroom[]
 *   "nodes"     → key: "list", value: DataroomNode[]
 *   "blobs"     → key: blobKey (UUID), value: Blob
 */
import type { Dataroom, DataroomNode } from '../model/types'

const DB_NAME = 'dataroom'
const DB_VERSION = 2
const STORE_DATAROOMS = 'datarooms'
const STORE_NODES = 'nodes'
const STORE_BLOBS = 'blobs'
const LIST_KEY = 'list'

// ── Database singleton ────────────────────────────────────────────────────────

let _db: IDBDatabase | null = null

const openDB = (): Promise<IDBDatabase> => {
  if (_db) {
    return Promise.resolve(_db)
  }

  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_DATAROOMS)) {
        db.createObjectStore(STORE_DATAROOMS)
      }
      if (!db.objectStoreNames.contains(STORE_NODES)) {
        db.createObjectStore(STORE_NODES)
      }
      if (!db.objectStoreNames.contains(STORE_BLOBS)) {
        db.createObjectStore(STORE_BLOBS)
      }
    }
    req.onsuccess = (event) => {
      _db = (event.target as IDBOpenDBRequest).result
      resolve(_db)
    }
    req.onerror = () => reject(req.error)
  })
}

const idbGet = <T>(store: string, key: string): Promise<T | undefined> =>
  openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readonly')
        const req = tx.objectStore(store).get(key)
        req.onsuccess = () => resolve(req.result as T | undefined)
        req.onerror = () => reject(req.error)
      }),
  )

const idbSet = (store: string, key: string, value: unknown): Promise<void> =>
  openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readwrite')
        const req = tx.objectStore(store).put(value, key)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      }),
  )

const idbDelete = (store: string, key: string): Promise<void> =>
  openDB().then(
    (db) =>
      new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readwrite')
        const req = tx.objectStore(store).delete(key)
        req.onsuccess = () => resolve()
        req.onerror = () => reject(req.error)
      }),
  )

// ── Datarooms ────────────────────────────────────────────────────────────────

export const persistDatarooms = async (datarooms: Dataroom[]): Promise<void> => {
  await idbSet(STORE_DATAROOMS, LIST_KEY, datarooms)
}

export const loadDatarooms = async (): Promise<Dataroom[]> =>
  (await idbGet<Dataroom[]>(STORE_DATAROOMS, LIST_KEY)) ?? []

// ── Nodes ────────────────────────────────────────────────────────────────────

export const persistNodes = async (nodes: DataroomNode[]): Promise<void> => {
  await idbSet(STORE_NODES, LIST_KEY, nodes)
}

export const loadNodes = async (): Promise<DataroomNode[]> =>
  (await idbGet<DataroomNode[]>(STORE_NODES, LIST_KEY)) ?? []

// ── Blobs ────────────────────────────────────────────────────────────────────

export const persistBlob = async (blobKey: string, blob: Blob): Promise<void> => {
  await idbSet(STORE_BLOBS, blobKey, blob)
}

export const loadBlob = async (blobKey: string): Promise<Blob | undefined> =>
  idbGet<Blob>(STORE_BLOBS, blobKey)

export const deleteBlob = async (blobKey: string): Promise<void> => {
  await idbDelete(STORE_BLOBS, blobKey)
}

export const deleteBlobs = async (blobKeys: string[]): Promise<void> => {
  await Promise.all(blobKeys.map(deleteBlob))
}
