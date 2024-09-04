import * as z from "zod";

export const CustomerSchema = z
  .object({
    name: z.string().min(1),
  })
  .refine(
    (data) =>
      //Todo
      true,
    {
      message: "Customer already exist",
    },
  );
