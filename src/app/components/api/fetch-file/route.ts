import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { filename } = await req.json();
  console.log('Im here bitches wuuuuuu')
  const res = await fetch('http://localhost:5000/api/storage/getFile', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename }),
  });

  if (!res.ok) {
    return new NextResponse("Error fetching file", { status: 500 });
  }

  const contentType = res.headers.get("Content-Type") || "application/octet-stream";
  const buffer = await res.arrayBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `inline; filename="${filename.split("\\").pop()}"`,
    },
  });
}
