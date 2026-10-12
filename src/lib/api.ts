import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AdapterError } from "@/lib/ghl";

/** Consistent JSON error envelope for every route. */
export function errorResponse(err: unknown) {
  if (err instanceof AdapterError) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
  }
  if (err instanceof ZodError) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", code: "invalid", issues: err.issues },
      { status: 400 },
    );
  }
  console.error(err);
  return NextResponse.json({ error: "Something went wrong. Please try again.", code: "server" }, { status: 500 });
}
