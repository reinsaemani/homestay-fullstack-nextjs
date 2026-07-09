export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];
