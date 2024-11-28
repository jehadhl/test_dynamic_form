import { z } from "zod";

export const formSchema = z.object({
  name_8066610423: z.string().min(1, "UserName is required"),
  age_12345: z
    .number({ invalid_type_error: "Age must be a number" })
    .min(1, "Age is required"),
  terms_001: z.boolean().refine((val) => val, "You must agree to the terms"),
  contact_method: z.string().optional(),
});
