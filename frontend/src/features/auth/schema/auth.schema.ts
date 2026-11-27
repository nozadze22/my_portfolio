import { z } from "zod";

export const authUserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  role: z.enum(["ADMIN", "USER"]),
  createdAt: z.coerce.date(),
});

export type AuthUser = z.infer<typeof authUserSchema>;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  fullName: z.string().max(120).optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginInput = {
  email: "",
  password: "",
};

export const registerFormSchema = registerSchema
  .extend({
    confirmPassword: z.string().min(8, "Confirm your password"),
    terms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.terms === true, {
    message: "You must accept the terms",
    path: ["terms"],
  });

export type RegisterFormInput = z.infer<typeof registerFormSchema>;

export const registerDefaultValues: RegisterFormInput = {
  email: "",
  password: "",
  confirmPassword: "",
  fullName: "",
  terms: false,
};