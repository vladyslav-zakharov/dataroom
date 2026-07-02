'use client';

import { FC, ReactNode, useState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DataroomError, useDataroomStore } from 'entities';
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

import {
  RenameNodeForm,
  renameNodeFormSchema,
  type RenameNodeFormSchema,
} from '../../../forms/ui/rename-node-form';

interface Props {
  node: DataroomNode;
  children: ReactNode;
}

export const RenameNodeDialog: FC<Props> = ({ node, children }) => {
  const [open, setOpen] = useState(false);
  const renameNode = useDataroomStore((store) => store.renameNode);

  const form = useForm<RenameNodeFormSchema>({
    resolver: zodResolver(renameNodeFormSchema),
    defaultValues: { name: node.name },
  });
  const {
    handleSubmit,
    setError,
    reset,
    watch,
    formState: { isSubmitting },
  } = form;
  const watchedName = watch('name');

  useEffect(() => {
    if (open) {
      reset({ name: node.name });
    }
  }, [open, node, reset]);

  const label = node.type === 'folder' ? 'Folder' : 'File';

  const onSubmit = handleSubmit(({ name }) => {
    try {
      renameNode(node.id, name);
      toast.success(`${label} renamed`);
      setOpen(false);
    } catch (error) {
      if (error instanceof DataroomError && error.code === 'NAME_COLLISION') {
        setError('name', { type: 'manual', message: 'An item with this name already exists here.' });
      } else if (error instanceof DataroomError && error.code === 'BLANK_NAME') {
        setError('name', { type: 'manual', message: 'Name cannot be blank.' });
      } else {
        setError('name', { type: 'manual', message: 'An unexpected error occurred.' });
      }
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename {label}</DialogTitle>
          <DialogDescription>Enter a new name for this item.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <RenameNodeForm form={form} />
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                watchedName.trim().length === 0 ||
                watchedName.trim() === node.name.trim()
              }
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
