'use client';

import { useMemo, useState, type FC } from 'react';

import { useRouter } from 'next/navigation';

import { useDataroomStore } from 'entities';
import { DatabaseIcon, PlusIcon, SearchIcon } from 'lucide-react';

import { CreateDataroomDialog, DataroomCard } from 'features';
import { useDebounce } from 'shared/hooks';
import { Button, EmptyState, SearchInput } from 'shared/ui';

const DataroomListPage: FC = () => {
  const router = useRouter();
  const datarooms = useDataroomStore(store => store.datarooms);
  const nodes = useDataroomStore(store => store.nodes);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query);

  const getRootCount = (dataroomId: string): number =>
    nodes.filter(
      node => node.dataroomId === dataroomId && node.parentId === null,
    ).length;

  const filteredDatarooms = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    if (!q) {
      return datarooms;
    }

    return datarooms.filter(dataroom =>
      dataroom.name.toLowerCase().includes(q),
    );
  }, [datarooms, debouncedQuery]);

  const renderContent = () => {
    if (datarooms.length === 0) {
      return (
        <EmptyState
          icon={<DatabaseIcon className="h-7 w-7" aria-hidden="true" />}
          title="No datarooms yet"
          description="Create your first dataroom to start organising due-diligence documents."
          action={
            <CreateDataroomDialog>
              <Button>
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
                New Dataroom
              </Button>
            </CreateDataroomDialog>
          }
        />
      );
    }

    if (filteredDatarooms.length === 0) {
      return (
        <EmptyState
          icon={<SearchIcon className="h-7 w-7" aria-hidden="true" />}
          title="No matching datarooms"
          description="No datarooms match your search. Try a different name."
        />
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDatarooms.map(dataroom => (
          <DataroomCard
            key={dataroom.id}
            dataroom={dataroom}
            itemCount={getRootCount(dataroom.id)}
            onOpen={() => router.push(`/dataroom/${dataroom.id}`)}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Datarooms</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Manage your due-diligence document rooms.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search datarooms"
            className="w-full sm:w-56 md:w-64"
          />
          <CreateDataroomDialog>
            <Button className="shrink-0">
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              New Dataroom
            </Button>
          </CreateDataroomDialog>
        </div>
      </div>

      {renderContent()}
    </>
  );
};

export default DataroomListPage;
