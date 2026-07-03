'use client';

import { FC, ReactNode, useState } from 'react';

import { toast } from 'sonner';

import { useDataroomStore } from 'entities';
import type { DataroomNode } from 'entities';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'shared/ui';

interface Props {
  node: DataroomNode;
  children: ReactNode;
}

export const DeleteNodeDialog: FC<Props> = ({ node, children }) => {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const deleteNode = useDataroomStore((store) => store.deleteNode);
  const getDescendantCounts = useDataroomStore((store) => store.getDescendantCounts);

  const buildDescription = () => {
    if (node.type === 'file') {
      return 'This action cannot be undone. The file will be permanently deleted.';
    }

    const { folders, files } = getDescendantCounts(node.id);
    const parts: string[] = [];

    if (folders > 0) {
      parts.push(`${folders} nested folder${folders !== 1 ? 's' : ''}`);
    }

    if (files > 0) {
      parts.push(`${files} file${files !== 1 ? 's' : ''}`);
    }

    if (parts.length === 0) {
      return 'This action cannot be undone. The empty folder will be permanently deleted.';
    }

    return `This action cannot be undone. Deleting this folder will also permanently remove ${parts.join(' and ')}.`;
  };

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await deleteNode(node.id);
      const nodeLabel = node.type === 'folder' ? 'Folder' : 'File';
      toast.success(`${nodeLabel} "${node.name}" deleted`);
      setOpen(false);
    } catch {
      toast.error('Failed to delete. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  const nodeLabel = node.type === 'folder' ? 'folder' : 'file';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {nodeLabel} &ldquo;{node.name}&rdquo;?
          </DialogTitle>
          <DialogDescription>{buildDescription()}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isPending}>
            {isPending ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
