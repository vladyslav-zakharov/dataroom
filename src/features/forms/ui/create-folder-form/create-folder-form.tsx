'use client';

import { FC } from 'react';

import { UseFormReturn } from 'react-hook-form';

import { FieldRequired, Form, FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from 'shared/ui';

import { type CreateFolderFormSchema } from './schema';

interface Props {
  form: UseFormReturn<CreateFolderFormSchema>;
}

export const CreateFolderForm: FC<Props> = ({ form }) => {
  const { control } = form;

  return (
    <Form {...form}>
      <div className="flex flex-col gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <FieldRequired>*</FieldRequired>
              </FormLabel>
              <FormControl>
                <Input placeholder="Folder name" autoFocus {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Form>
  );
};
