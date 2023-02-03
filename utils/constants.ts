export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ??
  "http://localhost:80";

export const PASSWORD_REGEXP =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%£&'()*+,-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$£%&'()*+,-.\/:;<=>?@[\\\]^_`{|}~]{8,32}$/i;
