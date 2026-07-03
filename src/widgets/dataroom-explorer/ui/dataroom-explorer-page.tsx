'use client';

import { useState, type FC } from 'react';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

import { useDataroomStore, type FileNode, type FolderNode } from 'entities';
import {
  DatabaseIcon,
  FolderOpenIcon,
  PlusIcon,
  SearchIcon,
} from 'lucide-react';

import {
  CreateFolderDialog,
  DropZone,
  FileRow,
  FolderRow,
  UploadButton,
} from 'features';
import { useDebounce } from 'shared/hooks';
import { Button, EmptyState, SearchInput } from 'shared/ui';

import ExplorerBreadcrumb from './explorer-breadcrumb';

const DataroomExplorerPage: FC = () => {
  const params = useParams<{ dataroomId: string; folderId?: string }>();
  const router = useRouter();

  const { dataroomId } = params;
  const { folderId } = params;

  const datarooms = useDataroomStore(store => store.datarooms);
  const nodes = useDataroomStore(store => store.nodes);
  const getChildren = useDataroomStore(store => store.getChildren);
  const getPath = useDataroomStore(store => store.getPath);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  // Resolve the dataroom — show not-found state if missing
  const dataroom = datarooms.find(dr => dr.id === dataroomId);

  if (!dataroom) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <DatabaseIcon className="h-7 w-7" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-foreground">Dataroom not found</p>
          <p className="text-sm text-muted-foreground">
            This dataroom may have been deleted or the link is invalid.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-all hover:bg-muted hover:text-foreground"
        >
          Back to Datarooms
        </Link>
      </div>
    );
  }

  // When a folderId is present, validate it exists in this dataroom
  if (folderId) {
    const folderNode = nodes.find(
      node =>
        node.id === folderId &&
        node.dataroomId === dataroomId &&
        node.type === 'folder',
    );

    if (!folderNode) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <DatabaseIcon className="h-7 w-7" aria-hidden="true" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-medium text-foreground">Folder not found</p>
            <p className="text-sm text-muted-foreground">
              This folder may have been deleted or the link is invalid.
            </p>
          </div>
          <Link
            href={`/dataroom/${dataroomId}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium transition-all hover:bg-muted hover:text-foreground"
          >
            Back to {dataroom.name}
          </Link>
        </div>
      );
    }
  }

  // The parentId for queries: null means dataroom root, folderId means inside that folder
  const parentId: string | null = folderId ?? null;

  // Ancestor path for breadcrumb (empty array when at root)
  const path = folderId ? getPath(folderId) : [];

  // Current folder's children (folders first, then files, alphabetical per group)
  const children = getChildren(dataroomId, parentId);
  const folders = children.filter(
    (node): node is FolderNode => node.type === 'folder',
  );
  const files = children.filter(
    (node): node is FileNode => node.type === 'file',
  );

  const q = debouncedQuery.trim().toLowerCase();
  const visibleFolders = q
    ? folders.filter(node => node.name.toLowerCase().includes(q))
    : folders;
  const visibleFiles = q
    ? files.filter(node => node.name.toLowerCase().includes(q))
    : files;
  const hasVisibleItems = visibleFolders.length + visibleFiles.length > 0;

  const currentTitle =
    path.length > 0 ? path[path.length - 1].name : dataroom.name;

  const renderDropZoneContent = () => {
    if (children.length === 0) {
      return (
        <EmptyState
          icon={<FolderOpenIcon className="h-7 w-7" aria-hidden="true" />}
          title="This folder is empty"
          description="Create a folder or upload a PDF file to get started."
        />
      );
    }

    if (!hasVisibleItems) {
      return (
        <EmptyState
          icon={<SearchIcon className="h-7 w-7" aria-hidden="true" />}
          title="No matching items"
          description="No files or folders match your search in this folder."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleFolders.map(node => (
          <FolderRow
            key={node.id}
            node={node}
            onOpen={folder =>
              router.push(`/dataroom/${dataroomId}/folder/${folder.id}`)
            }
          />
        ))}
        {visibleFiles.map(node => (
          <FileRow key={node.id} node={node} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="mb-4">
        <ExplorerBreadcrumb dataroom={dataroom} path={path} />
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{currentTitle}</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search files & folders"
            className="w-full sm:w-48 md:w-56"
          />
          <div className="flex items-center gap-2">
            <CreateFolderDialog dataroomId={dataroomId} parentId={parentId}>
              <Button variant="outline" className="shrink-0">
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
                New Folder
              </Button>
            </CreateFolderDialog>
            <UploadButton dataroomId={dataroomId} parentId={parentId} />
          </div>
        </div>
      </div>

      <DropZone dataroomId={dataroomId} parentId={parentId}>
        {renderDropZoneContent()}
      </DropZone>
    </>
  );
};

export default DataroomExplorerPage;
