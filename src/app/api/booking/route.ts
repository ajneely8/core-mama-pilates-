import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/ghl";
import { errorResponse } from "@/lib/api";
import { createBookingSchema, splitName } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

/** POST /api/booking — create a reservation (demo or live, by adapter). */
export async function POST(req: NextRequest) {
  try {
    const body = createBookingSchema.parse(await req.json());
    const { firstName, lastName } = splitName(body.details.fullName);
    const appointment = await getAdapter().createAppointment({
      typeId: body.typeId,
      start: body.start,
      timezone: body.timezone,
      notes: body.details.notes || null,
      childcare: Number(body.details.childcare),
      source: body.source ?? "website-booking",
      contact: { firstName, lastName, email: body.details.email, phone: body.details.phone },
    });
    return NextResponse.json({ appointment }, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
