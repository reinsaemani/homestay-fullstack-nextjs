import { NextRequest, NextResponse } from "next/server";
import { getIncomeReport } from "@/features/reports/services/getIncomeReport";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") as "weekly" | "monthly" | "yearly";
    const value = searchParams.get("value") || "";

    if (!period || !value) {
      return NextResponse.json(
        { error: "period and value are required" },
        { status: 400 },
      );
    }

    const data = await getIncomeReport(period, value);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch income report" },
      { status: 500 },
    );
  }
}
