/**
 * Date helpers.
 * Dates are saved as text "YYYY-MM-DD" and shown as "01 Nov 2026".
 * We never use toISOString (it uses UTC and can give the wrong day)
 * and never use Intl, so every phone shows the same thing.
 */

// Month names, written by hand. January is index 0.
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** Add a zero in front of small numbers: 5 -> "05". */
function twoDigits(value: number): string {
  return value < 10 ? "0" + value : String(value);
}

/**
 * Turn a Date into "YYYY-MM-DD" using the LOCAL year, month and day.
 * Example: toISODate(new Date(2026, 10, 1)) gives "2026-11-01".
 */
export function toISODate(date: Date): string {
  const year = date.getFullYear();
  // getMonth() starts at 0, so we add 1 to get the real month.
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return String(year) + "-" + twoDigits(month) + "-" + twoDigits(day);
}

/** Today's date as "YYYY-MM-DD". */
export function todayISO(): string {
  return toISODate(new Date());
}

/**
 * Check that a text is a real date written exactly as "YYYY-MM-DD".
 * "2026-02-30" is false because February has no 30th day.
 */
export function isValidISODate(value: string): boolean {
  // Must be exactly 4 digits, dash, 2 digits, dash, 2 digits.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));

  // Month must be 1 to 12.
  if (month < 1 || month > 12) {
    return false;
  }

  // Day #0 of the next month is the last day of this month.
  const lastDay = new Date(year, month, 0).getDate();

  return day >= 1 && day <= lastDay;
}

/**
 * Show a saved date in a friendly way: "2026-11-01" gives "01 Nov 2026".
 * If the text is not a valid date, we return it unchanged.
 */
export function formatDisplayDate(value: string): string {
  if (!isValidISODate(value)) {
    return value;
  }

  const year = value.slice(0, 4);
  const month = Number(value.slice(5, 7));
  const day = value.slice(8, 10);

  return day + " " + MONTHS[month - 1] + " " + year;
}
