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
  RenameDataroomForm,
  renameDataroomFormSchema,
  type RenameDataroomFormSchema,
} from '../../../forms/ui/rename-dataroom-form';

interface Props {
  dataroomId: string;
  currentName: string;
  children: ReactNode;
}

export const RenameDataroomDialog: FC<Props> = ({ dataroomId, currentName, children }) => {
  const [open, setOpen] = useState(false);
  const renameDataroom = useDataroomStore((store) => store.renameDataroom);

  const form = useForm<RenameDataroomFormSchema>({
    resolver: zodResolver(renameDataroomFormSchema),
    defaultValues: { name: currentName },
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
      reset({ name: currentName });
    }
  }, [open, currentName, reset]);

  const onSubmit = handleSubmit(({ name }) => {
    try {
      renameDataroom(dataroomId, name);
      toast.success('Dataroom renamed');
      setOpen(false);
    } catch (error) {
      if (error instanceof DataroomError && error.code === 'NAME_COLLISION') {
        setError('name', { type: 'manual', message: 'A dataroom with this name already exists.' });
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
          <DialogTitle>Rename Dataroom</DialogTitle>
          <DialogDescription>Enter a new name for this dataroom.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <RenameDataroomForm form={form} />
          <DialogFooter>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                watchedName.trim().length === 0 ||
                watchedName.trim() === currentName.trim()
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
