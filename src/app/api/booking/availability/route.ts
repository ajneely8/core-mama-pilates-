import { NextRequest, NextResponse } from "next/server";
import { bookingConfig, getBookingType } from "@/config/booking";
import { site } from "@/config/site";
import { getAdapter } from "@/lib/ghl";
import { errorResponse } from "@/lib/api";
import { dateKeyInTz } from "@/lib/time";

export const dynamic = "force-dynamic";

/**
 * GET /api/booking/availability?typeId=reformer-session
 * Returns every open slot inside the booking window, as UTC instants, plus the
 * studio time zone so the client can render in the visitor's zone.
 */
export async function GET(req: NextRequest) {
  try {
    const typeId = req.nextUrl.searchParams.get("typeId") ?? "";
    if (!getBookingType(typeId)) {
      return NextResponse.json({ error: "Unknown booking type", code: "invalid" }, { status: 400 });
    }
    const now = Date.now();
    const from = dateKeyInTz(now, site.timezone);
    const to = dateKeyInTz(now + bookingConfig.windowDays * 86_400_000, site.timezone);
    const result = await getAdapter().getAvailability({ typeId, from, to });
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    return errorResponse(err);
  }
}
