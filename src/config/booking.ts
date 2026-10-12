/**
 * Booking configuration. Each booking type maps to one GoHighLevel calendar
 * through an environment variable, so the studio can create calendars later
 * without any code changes. Everything flagged `sample` is demo content.
 */
export type BookingType = {
  id: string;
  name: string;
  durationMin: number;
  description: string;
  /** Name of the env var holding the GHL calendar ID for this type. */
  ghlCalendarEnv: string;
  sample: boolean;
};

export type DayHours = { open: string; close: string } | null;

export const bookingConfig = {
  /** How far ahead the calendar opens. */
  windowDays: 45,
  /** Minimum notice before a slot can be reserved (minutes). */
  minNoticeMinutes: 120,
  /** Sample number of reformers; used for demo capacity only. */
  sampleCapacity: 4,

  types: [
    {
      id: "reformer-session",
      name: "Self-Guided Reformer Session",
      durationMin: 60,
      description:
        "A one-hour reformer reservation. Choose an on-demand class at your kiosk and move at your own pace. Add a CoreNest childcare reservation if you need one.",
      ghlCalendarEnv: "GHL_CALENDAR_ID_REFORMER",
      sample: true,
    },
    {
      id: "first-visit",
      name: "First Visit & Orientation",
      durationMin: 60,
      description: "New here? Get set up on the reformer, learn the basics, and take your first session.",
      ghlCalendarEnv: "GHL_CALENDAR_ID_FIRST_VISIT",
      sample: true,
    },
    {
      id: "studio-tour",
      name: "Studio Tour",
      durationMin: 20,
      description: "See the space, ask questions, and find out whether Core Mama is right for you.",
      ghlCalendarEnv: "GHL_CALENDAR_ID_TOUR",
      sample: true,
    },
  ] satisfies BookingType[],

  /**
   * SAMPLE studio hours for demo availability only (0 = Sunday … 6 = Saturday).
   * Real availability comes from the GHL calendar once connected.
   */
  sampleHours: {
    0: null,
    1: { open: "06:00", close: "20:00" },
    2: { open: "06:00", close: "20:00" },
    3: { open: "06:00", close: "20:00" },
    4: { open: "06:00", close: "20:00" },
    5: { open: "06:00", close: "19:00" },
    6: { open: "07:00", close: "14:00" },
  } as Record<number, DayHours>,
};

export function getBookingType(id: string): BookingType | undefined {
  return bookingConfig.types.find((t) => t.id === id);
}
