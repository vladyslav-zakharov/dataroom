import { z } from 'zod';

const renameDataroomFormSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be blank.'),
});

type RenameDataroomFormSchema = z.infer<typeof renameDataroomFormSchema>;

export { renameDataroomFormSchema, type RenameDataroomFormSchema };
