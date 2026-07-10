import { NextRequest, NextResponse } from "next/server";
import { deleteEntry } from "@/features/piggybank/services/deleteEntry";
import { updateEntry } from "@/features/piggybank/services/updateEntry";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await updateEntry(id, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to update entry" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteEntry(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete entry" },
      { status: 500 },
    );
  }
}
