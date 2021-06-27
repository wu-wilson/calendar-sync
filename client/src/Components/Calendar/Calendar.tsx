// Imports
import moment, { Moment } from "moment";
import type { counts } from "./BuildHashtable";
import { useState, useEffect, useCallback } from "react";
import buildCalendar from "./BuildCalendar";

const Calendar = ({
  selectedDate,
  setSelectedDate,
  table,
}: {
  selectedDate: Moment;
  setSelectedDate: (day: Moment) => void;
  table: { [key: string]: counts };
}) => {
  // Store an array of week abbreviations.
  const WeekHeader = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  // Store the month's arrays of weeks in calendar
  const [calendar, setCalendar] = useState<Moment[][]>([]);
  /* 
  Store the selected month in value. We will manipulate value to
  change the month displayed.
  */
  const [value, setValue] = useState<Moment>(moment());
  // Store start and end of the current month
  const monthStart = value.clone().startOf("month");
  const monthEnd = value.clone().endOf("month");

  // Changes the month displayed by manipulating value.
  const handlePrev = () => {
    setValue(value.clone().subtract(1, "month"));
  };
  const handleNext = () => {
    setValue(value.clone().add(1, "month"));
  };

  // Changes the selected day.
  const changeDate = (day: Moment) => {
    setSelectedDate(day);
  };

  // Change display of calendar every time month value changes
  useEffect(() => {
    setCalendar(buildCalendar(value));
  }, [value]);

  // Return the number of active items for a day
  const numActiveItems = useCallback(
    (day: Moment) => {
      const day_id = day.format("YYYY-MM-DD");

      const total: number | undefined = table[day_id]?.count_total;
      const completed: string | undefined = table[day_id]?.count_completed;

      if (total && completed) {
        return total - parseInt(completed);
      } else {
        return null;
      }
    },
    [table]
  );

  /* 
  Check if a day is selected, before today, today, or after today.
  We will use this for styling.
  */
  const dayStyles = (day: Moment) => {
    if (day.isSame(selectedDate, "day")) {
      return "selected";
    }
    if (day.isSame(new Date(), "day")) {
      return "today";
    }
    if (day.isBefore(monthStart, "day")) {
      return "before";
    }
    if (day.isAfter(monthEnd, "day")) {
      return "after";
    }
    return "";
  };

  return (
    <div className="CalContainer">
      <div className="CalHeader">
        <button className="CalPrevBtn" onClick={handlePrev}>
          Prev
        </button>
        {value.format("MMMM, YYYY")}
        <button className="CalNextBtn" onClick={handleNext}>
          Next
        </button>
      </div>
      <div className="CalWeek">
        {WeekHeader.map((dayHeader) => (
          <div className="CalDayHeader" key={dayHeader}>
            {dayHeader}
          </div>
        ))}
      </div>
      {calendar.map((week) => (
        <div className="CalWeek" key={week[0].format("YYYY-MM-DD")}>
          {week.map((day) => (
            <div
              className={`CalDay ${dayStyles(day)}`}
              onClick={() => changeDate(day)}
              key={day.format("YYYY-MM-DD")}
            >
              {day.format("D")}
              <div className="CalActiveItemsContainer">
                {numActiveItems(day) !== null
                  ? `${numActiveItems(day)} active items`
                  : null}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Calendar;
