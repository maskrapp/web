import { z } from "zod";

export const tokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$/);

export const verificationCodeSchema = z
  .string()
  .regex(new RegExp("^[0-9]{5}$"));
