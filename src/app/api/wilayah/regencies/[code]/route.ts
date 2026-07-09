import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  const res = await fetch(`https://wilayah.id/api/regencies/${code}.json`);
  const data = await res.json();
  return NextResponse.json(data);
}
