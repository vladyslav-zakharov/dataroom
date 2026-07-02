'use client';

import { FC } from 'react';

import { FileTextIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon } from 'lucide-react';

import type { FileNode } from 'entities';
import { formatBytes } from 'entities';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'shared/ui';

import { DeleteNodeDialog } from '../../dialogs/ui/delete/delete-node-dialog';
import { RenameNodeDialog } from '../../dialogs/ui/update/rename-node-dialog';
import { PdfViewerDialog } from '../../view-pdf/ui/pdf-viewer-dialog';

interface Props {
  node: FileNode;
}

export const FileRow: FC<Props> = ({ node }) => {
  return (
    <div className="group flex w-full items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
      <PdfViewerDialog node={node}>
        <Button
          variant="ghost"
          className="flex flex-1 items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded min-w-0 justify-start p-0 h-auto font-normal hover:bg-transparent"
          aria-label={`Open file ${node.name}`}
        >
          <FileTextIcon
            className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent-foreground"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{node.name}</span>
            <span className="block text-xs text-muted-foreground group-hover:text-accent-foreground/70">
              {formatBytes(node.size)}
            </span>
          </span>
        </Button>
      </PdfViewerDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground"
            aria-label={`Actions for ${node.name}`}
            onClick={(event) => event.stopPropagation()}
          >
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <RenameNodeDialog node={node}>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <PencilIcon className="h-4 w-4" />
              Rename
            </DropdownMenuItem>
          </RenameNodeDialog>
          <DropdownMenuSeparator />
          <DeleteNodeDialog node={node}>
            <DropdownMenuItem
              onSelect={(event) => event.preventDefault()}
              className="text-destructive focus:text-destructive"
            >
              <Trash2Icon className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DeleteNodeDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
