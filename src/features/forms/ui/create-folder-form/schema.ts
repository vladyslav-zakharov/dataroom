import { z } from 'zod';

const createFolderFormSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be blank.'),
});

type CreateFolderFormSchema = z.infer<typeof createFolderFormSchema>;

export { createFolderFormSchema, type CreateFolderFormSchema };
