import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

type Body = { path: string } | Array<{ path: string }>;
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("secret") !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const paths = Array.isArray(body) ? body.map((p) => p.path) : [body.path];

  if (!paths.every(Boolean)) {
    return NextResponse.json({ message: "Path required" }, { status: 400 });
  }

  paths.forEach((p) => {
    revalidatePath(p);
    if (p === "/") {
      revalidatePath(p, "layout");
    }
  });

  return NextResponse.json({ revalidated: true, paths });
}
