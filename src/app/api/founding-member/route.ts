import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/ghl";
import { errorResponse } from "@/lib/api";
import { foundingMemberSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

/**
 * POST /api/founding-member
 * Creates or updates the contact, applies the founding-member tag, enrols the
 * contact in the launch workflow, records the signup source, and de-duplicates.
 */
export async function POST(req: NextRequest) {
  try {
    const body = foundingMemberSchema.parse(await req.json());
    const tag = process.env.GHL_FOUNDING_TAG || "CoreMama-FoundingMember";
    const result = await getAdapter().upsertLead({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone || null,
      consent: body.consent,
      source: body.source || "website",
      tags: [tag],
      workflowId: process.env.GHL_FOUNDING_WORKFLOW_ID || null,
      customFields: { signup_source: body.source || "website", marketing_consent: String(body.consent) },
    });
    return NextResponse.json(result, { status: result.duplicate ? 200 : 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
