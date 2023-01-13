export interface UserDetails {
  tier: number;
}

export interface Email {
  email: string;
  is_primary: boolean;
  is_verified: boolean;
}

export interface Mask {
  mask: string;
  enabled: boolean;
  email: string;
  messages_received: number;
  messages_forwarded: number;
}

export interface APIResponse {
  success: boolean;
  message?: string;
}

export interface Token {
  token: string;
  expires_at: number;
  provider: string;
}

export interface TokenPair {
  refresh_token: Token;
  access_token: Token;
}

export interface Domain {
  domain: string;
  free: boolean;
}
