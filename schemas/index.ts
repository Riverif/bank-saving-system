import * as z from "zod";

const currentDate = new Date();

export const DepositoTypeSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine((value) => !/^\d/.test(value), {
      message: "Name cannot start with a number",
    }),
  yearlyReturn: z.coerce.number().min(0.01).max(1),
});

export const WithdrawalSchema = z.object({
  withdrawDate: z.date().refine((date) => date >= currentDate, {
    message: "The date cannot be in the past.",
  }),
});

export const AccountSchema = z.object({
  packet: z.string().min(1),
  balance: z.coerce.number().min(10000),
});

export const CustomerSchema = z.object({
  name: z
    .string()
    .min(1)
    .refine((value) => !/^\d/.test(value), {
      message: "Name cannot start with a number",
    }),
});
