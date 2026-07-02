'use client';

import { FC, ReactNode, useState } from 'react';

import { toast } from 'sonner';

import { useDataroomStore } from 'entities';
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
  dataroomId: string;
  dataroomName: string;
  children: ReactNode;
}

export const DeleteDataroomDialog: FC<Props> = ({ dataroomId, dataroomName, children }) => {
  const [open, setOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const deleteDataroom = useDataroomStore((store) => store.deleteDataroom);
  const nodes = useDataroomStore((store) => store.nodes);

  const folderCount = nodes.filter(
    (node) => node.dataroomId === dataroomId && node.type === 'folder',
  ).length;
  const fileCount = nodes.filter(
    (node) => node.dataroomId === dataroomId && node.type === 'file',
  ).length;

  const buildSummary = () => {
    const parts: string[] = [];

    if (folderCount > 0) {
      parts.push(`${folderCount} folder${folderCount !== 1 ? 's' : ''}`);
    }

    if (fileCount > 0) {
      parts.push(`${fileCount} file${fileCount !== 1 ? 's' : ''}`);
    }

    if (parts.length === 0) {
      return 'It contains no items.';
    }

    return `It contains ${parts.join(' and ')}, which will also be permanently deleted.`;
  };

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await deleteDataroom(dataroomId);
      toast.success(`"${dataroomName}" deleted`);
      setOpen(false);
    } catch {
      toast.error('Failed to delete dataroom');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete &ldquo;{dataroomName}&rdquo;?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. {buildSummary()}
          </DialogDescription>
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
