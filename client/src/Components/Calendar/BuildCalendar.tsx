// Imports
import { Moment } from "moment";

const buildCalendar = (value: Moment) => {
  // We will return this array
  const calendar: Moment[][] = [];

  // Start and end day of the current month
  const startDay = value.clone().startOf("month").startOf("week");
  const endDay = value.clone().endOf("month").endOf("week");

  /* 
  Checks if the number of days required in the calendar for that 
  month is less than 42 
  */
  const checkNumDays = () => {
    let numDays = 1;
    let dayCheck = startDay.clone().subtract(1, "day");
    while (dayCheck.isBefore(endDay, "day")) {
      dayCheck.add(1, "day");
      numDays += 1;
    }
    if (numDays < 42) {
      return true;
    } else {
      return false;
    }
  };

  /* 
  If checkNumDays() returns true, push one extra row of weeks. Else,
  push the appropriate number of weeks 
  */
  if (checkNumDays()) {
    const day = startDay.clone().subtract(8, "day");
    while (day.isBefore(endDay, "day")) {
      calendar.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone())
      );
    }
  } else {
    const day = startDay.clone().subtract(1, "day");
    while (day.isBefore(endDay, "day")) {
      calendar.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, "day").clone())
      );
    }
  }

  // Return calendar array
  return calendar;
};

export default buildCalendar;
