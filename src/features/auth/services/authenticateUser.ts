import bcrypt from "bcryptjs";
import { getUserByEmail } from "./getUserByEmail";
import type { UserRole } from "../../../../generated/prisma/client";

interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export async function authenticateUser(
  email: string,
  password: string,
): Promise<AuthenticatedUser | null> {
  const user = await getUserByEmail(email);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
