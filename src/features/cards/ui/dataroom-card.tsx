'use client';

import { FC } from 'react';

import { DatabaseIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';

import type { Dataroom } from 'entities';
import { formatDate } from 'shared/lib';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'shared/ui';

import { DeleteDataroomDialog } from '../../dialogs/ui/delete/delete-dataroom-dialog';
import { RenameDataroomDialog } from '../../dialogs/ui/update/rename-dataroom-dialog';

interface Props {
  dataroom: Dataroom;
  itemCount: number;
  onOpen: () => void;
}

export const DataroomCard: FC<Props> = ({ dataroom, itemCount, onOpen }) => {
  const formattedDate = formatDate(dataroom.createdAt);

  const itemLabel = itemCount === 1 ? '1 item' : `${itemCount} items`;

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md hover:ring-1 hover:ring-foreground/20 focus-within:ring-2 focus-within:ring-ring"
      role="article"
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <DatabaseIcon className="h-4 w-4" aria-hidden="true" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground"
                aria-label={`Actions for ${dataroom.name}`}
                onClick={(event) => event.stopPropagation()}
              >
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <RenameDataroomDialog dataroomId={dataroom.id} currentName={dataroom.name}>
                <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
                  <PencilIcon className="h-4 w-4" />
                  Rename
                </DropdownMenuItem>
              </RenameDataroomDialog>
              <DropdownMenuSeparator />
              <DeleteDataroomDialog dataroomId={dataroom.id} dataroomName={dataroom.name}>
                <DropdownMenuItem
                  onSelect={(event) => event.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2Icon className="h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DeleteDataroomDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardTitle
          className="cursor-pointer text-base"
          onClick={onOpen}
          tabIndex={0}
          role="button"
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              onOpen();
            }
          }}
        >
          {dataroom.name}
        </CardTitle>
        <CardDescription>{itemLabel}</CardDescription>
      </CardHeader>
      <CardContent className="cursor-pointer" onClick={onOpen}>
        <p className="text-xs text-muted-foreground">Created {formattedDate}</p>
      </CardContent>
    </Card>
  );
};
