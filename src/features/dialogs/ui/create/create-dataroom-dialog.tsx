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
  CreateDataroomForm,
  createDataroomFormSchema,
  type CreateDataroomFormSchema,
} from '../../../forms/ui/create-dataroom-form';

interface Props {
  children: ReactNode;
  onCreated?: (id: string) => void;
}

export const CreateDataroomDialog: FC<Props> = ({ children, onCreated }) => {
  const [open, setOpen] = useState(false);
  const createDataroom = useDataroomStore((store) => store.createDataroom);

  const form = useForm<CreateDataroomFormSchema>({
    resolver: zodResolver(createDataroomFormSchema),
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
      const dataroom = createDataroom(name);
      toast.success(`"${dataroom.name}" created`);
      onCreated?.(dataroom.id);
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
          <DialogTitle>New Dataroom</DialogTitle>
          <DialogDescription>Create a new dataroom to organise your documents.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <CreateDataroomForm form={form} />
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
