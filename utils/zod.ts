import { z } from "zod";
export const tokenRegex = new RegExp(
  "^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$"
);

export const tokenSchema = z.object({
  token: z.string().regex(tokenRegex),
  expires_at: z.number(),
});

export const pairSchema = z.object({
  access_token: tokenSchema,
  refresh_token: tokenSchema,
});
export const verificationCodeSchema = z
  .string()
  .regex(new RegExp("^[0-9]{5}$"));
