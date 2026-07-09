import { NextRequest, NextResponse } from "next/server";
import { getEntries } from "@/features/piggybank/services/getEntries";
import { createEntry } from "@/features/piggybank/services/createEntry";

export async function GET() {
  try {
    const data = await getEntries();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch piggy bank entries" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const entry = await createEntry(body);
    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create entry" },
      { status: 500 },
    );
  }
}
