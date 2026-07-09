import type { PiggyBank } from "../../../../generated/prisma/client";

export type { PiggyBank };

export interface PiggyBankFormData {
  description: string;
  amount: number;
  type: "IN" | "OUT";
}

export interface PiggyBankListResponse {
  entries: PiggyBank[];
  total: number;
}
