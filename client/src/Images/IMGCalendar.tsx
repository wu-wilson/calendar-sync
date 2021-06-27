// Imports
import BuildCalendar from "../Components/Calendar/BuildCalendar";
import moment, { Moment } from "moment";

const CalendarImg = () => {
  // Store the current date
  const value = moment();
  // Create and store an array of days for a specific month.
  const calendar = BuildCalendar(value);
  // Store the start and end of the month
  const monthStart = value.clone().startOf("month");
  const monthEnd = value.clone().endOf("month");
  // Store week abbreviations in this array
  const weekHeader = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Returns a string that is used to style each day on the calendar.
  const dayStyles = (day: Moment) => {
    if (day.isSame(new Date(), "day")) {
      return "selected";
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
    <div className="IMGContainer">
      <div className="IMGCalendarHeader">
        <div className="IMGPrev">Prev</div>
        {value.format("MMMM, YYYY")}
        <div className="IMGNext">Next</div>
      </div>
      <div className="IMGWeek">
        {weekHeader.map((day) => (
          <div className="IMGDay" key={day.toString()}>
            {day}
          </div>
        ))}
      </div>
      <div>
        {calendar.map((week) => (
          <div className="IMGWeek" key={week[0].format("YYYY-MM-DD")}>
            {week.map((day) => (
              <div
                className={`IMGDay ${dayStyles(day)}`}
                key={day.format("YYYY-MM-DD")}
              >
                {day.format("D")}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarImg;
