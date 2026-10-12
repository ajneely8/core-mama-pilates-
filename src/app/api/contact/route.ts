import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/ghl";
import { errorResponse } from "@/lib/api";
import { contactSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

/** POST /api/contact — contact-form message. */
export async function POST(req: NextRequest) {
  try {
    const body = contactSchema.parse(await req.json());
    const result = await getAdapter().submitContactMessage(body);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
