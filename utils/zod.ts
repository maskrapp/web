import { z } from "zod";
export const tokenRegex = new RegExp(
  "^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$",
);

export const tokenSchema = z.string().regex(tokenRegex);

const tokenObjectSchema = z.object({
  token: tokenSchema,
  expires_at: z.number(),
  email_login: z.boolean(),
});

export const pairSchema = z.object({
  access_token: tokenObjectSchema,
  refresh_token: tokenObjectSchema,
});
export const verificationCodeSchema = z
  .string()
  .regex(new RegExp("^[0-9]{5}$"));
