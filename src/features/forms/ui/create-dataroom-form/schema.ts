import { z } from 'zod';

const createDataroomFormSchema = z.object({
  name: z.string().trim().min(1, 'Name cannot be blank.'),
});

type CreateDataroomFormSchema = z.infer<typeof createDataroomFormSchema>;

export { createDataroomFormSchema, type CreateDataroomFormSchema };
