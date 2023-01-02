/** Calculate the number of days between two dates. b must be later than a. */
export const daysBetween = (a: Date, b: Date) => {
  const Difference_In_Time = b.getTime() - a.getTime();

  // To calculate the no. of days between two dates
  const Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

  return Math.round(Difference_In_Days);
};

/** Add days to date */
// https://stackoverflow.com/questions/563406/how-to-add-days-to-date
export function addDays(date: Date, days: number) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
