'use client';

import { type FC } from 'react';

import { DatabaseIcon, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { useDataroomStore } from 'entities';
import { CreateDataroomDialog, DataroomCard } from 'features';
import { Button, EmptyState } from 'shared/ui';

const DataroomListPage: FC = () => {
  const router = useRouter();
  const datarooms = useDataroomStore((store) => store.datarooms);
  const nodes = useDataroomStore((store) => store.nodes);

  const getRootCount = (dataroomId: string): number =>
    nodes.filter((node) => node.dataroomId === dataroomId && node.parentId === null).length;

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Datarooms</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your due-diligence document rooms.
          </p>
        </div>
        <CreateDataroomDialog>
          <Button>
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            New Dataroom
          </Button>
        </CreateDataroomDialog>
      </div>

      {datarooms.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {datarooms.map((dataroom) => (
            <DataroomCard
              key={dataroom.id}
              dataroom={dataroom}
              itemCount={getRootCount(dataroom.id)}
              onOpen={() => router.push(`/dataroom/${dataroom.id}`)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default DataroomListPage;
