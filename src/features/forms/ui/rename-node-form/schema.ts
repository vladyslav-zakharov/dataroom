import { z } from 'zod';

const renameNodeFormSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be blank.'),
});

type RenameNodeFormSchema = z.infer<typeof renameNodeFormSchema>;

export { renameNodeFormSchema, type RenameNodeFormSchema };
