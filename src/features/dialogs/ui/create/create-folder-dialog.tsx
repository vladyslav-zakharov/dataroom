'use client';

import { FC, ReactNode, useState, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DataroomError, useDataroomStore } from 'entities';
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
  CreateFolderForm,
  createFolderFormSchema,
  type CreateFolderFormSchema,
} from '../../../forms/ui/create-folder-form';

interface Props {
  dataroomId: string;
  parentId: string | null;
  children: ReactNode;
}

export const CreateFolderDialog: FC<Props> = ({ dataroomId, parentId, children }) => {
  const [open, setOpen] = useState(false);
  const createFolder = useDataroomStore((store) => store.createFolder);

  const form = useForm<CreateFolderFormSchema>({
    resolver: zodResolver(createFolderFormSchema),
    defaultValues: { name: '' },
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
      reset({ name: '' });
    }
  }, [open, reset]);

  const onSubmit = handleSubmit(({ name }) => {
    try {
      const folder = createFolder(dataroomId, parentId, name);
      toast.success(`Folder "${folder.name}" created`);
      setOpen(false);
    } catch (error) {
      if (error instanceof DataroomError && error.code === 'NAME_COLLISION') {
        setError('name', {
          type: 'manual',
          message: 'A folder or file with this name already exists here.',
        });
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
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>Create a new folder to organise your files.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <CreateFolderForm form={form} />
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || watchedName.trim().length === 0}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
