import { z } from 'zod';

export const namedValueSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const userSchema = z.object({
  name: z.string().min(1, { message: "Full Name is required." }),
  department: namedValueSchema.refine(data => data.value !== '', { message: "Department is required." }),
  country: namedValueSchema.refine(data => data.value !== '', { message: "Country is required." }),
  status: namedValueSchema.refine(data => data.value !== '', { message: "Status is required." }),
});

export type UserFormValues = z.infer<typeof userSchema>;