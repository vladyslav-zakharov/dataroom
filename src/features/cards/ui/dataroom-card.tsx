'use client';

import { FC } from 'react';

import type { Dataroom } from 'entities';
import {
  DatabaseIcon,
  MoreHorizontalIcon,
  PencilIcon,
  Trash2Icon,
} from 'lucide-react';

import { formatDate } from 'shared/lib';
import {
  BorderGlow,
  Button,
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
    <BorderGlow
      className="h-full cursor-pointer backdrop-blur-md transition-shadow"
      backgroundColor="hsl(var(--card) / 0.6)"
      glowColor="260 80 72"
      colors={['#c084fc', '#818cf8', '#38bdf8']}
      borderRadius={12}
      glowRadius={30}
      edgeSensitivity={25}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open ${dataroom.name}`}
        className="flex flex-1 flex-col rounded-[inherit] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={onOpen}
        onKeyDown={event => {
          if (
            (event.key === 'Enter' || event.key === ' ') &&
            event.target === event.currentTarget
          ) {
            event.preventDefault();
            onOpen();
          }
        }}
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
                  onClick={event => event.stopPropagation()}
                >
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                onClick={event => event.stopPropagation()}
              >
                <RenameDataroomDialog
                  dataroomId={dataroom.id}
                  currentName={dataroom.name}
                >
                  <DropdownMenuItem onSelect={event => event.preventDefault()}>
                    <PencilIcon className="h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                </RenameDataroomDialog>
                <DropdownMenuSeparator />
                <DeleteDataroomDialog
                  dataroomId={dataroom.id}
                  dataroomName={dataroom.name}
                >
                  <DropdownMenuItem
                    onSelect={event => event.preventDefault()}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2Icon className="h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DeleteDataroomDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <CardTitle className="text-base">{dataroom.name}</CardTitle>
          <CardDescription>{itemLabel}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground">
            Created {formattedDate}
          </p>
        </CardContent>
      </div>
    </BorderGlow>
  );
};
