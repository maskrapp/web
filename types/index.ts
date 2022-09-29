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
  emails: {
    email: string;
  };
}

export interface APIResponse {
  success: boolean;
  message?: string;
}
