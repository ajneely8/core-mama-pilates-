import { NextRequest, NextResponse } from "next/server";
import { getAdapter } from "@/lib/ghl";
import { errorResponse } from "@/lib/api";
import { rescheduleSchema } from "@/lib/validation/schemas";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** GET /api/booking/:id — fetch a reservation. */
export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const appointment = await getAdapter().getAppointment(id);
    if (!appointment) return NextResponse.json({ error: "Not found", code: "not_found" }, { status: 404 });
    return NextResponse.json({ appointment });
  } catch (err) {
    return errorResponse(err);
  }
}

/** DELETE /api/booking/:id — cancel. */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const appointment = await getAdapter().cancelAppointment(id);
    return NextResponse.json({ appointment });
  } catch (err) {
    return errorResponse(err);
  }
}

/** PATCH /api/booking/:id — reschedule to a new start instant. */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const { start } = rescheduleSchema.parse(await req.json());
    const appointment = await getAdapter().rescheduleAppointment(id, start);
    return NextResponse.json({ appointment });
  } catch (err) {
    return errorResponse(err);
  }
}
