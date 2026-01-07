// src/lib/dateUtils.ts
export function getPeriodDates(period: string) {
  const now = new Date();

  let startDate: Date;
  let endDate: Date = now;

  switch (period) {
    case "day":
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      break;

    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;

    case "month":
    default:
      startDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );
      break;
  }

  return {
    startDate: startDate.toISOString().slice(0, 10),
    endDate: endDate.toISOString().slice(0, 10),
  };
}
