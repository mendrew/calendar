"use strict";

const CELLS_IN_MONTH = 35;

function isWeekendIndex(dayIndex, monthFirstDayIndex) {
  const sunday = 0;
  const saturday = 6;

  const weekDay = dayIndex % 7;
  return weekDay === sunday || weekDay === saturday;
}

// An integer between 0 and 6
function getWeekDayOfFirstDayInMonth(date) {
  const dateCopy = new Date(date);
  dateCopy.setDate(1);
  return dateCopy.getDay();
}

// An integer number, between 1 and 31
function getLastDayInMonth(date) {
  const lastDayInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDayInMonth;
}

function initializeCalendar() {
  const currentDate = new Date();
  const monthFirstDayIndex = getWeekDayOfFirstDayInMonth(currentDate);

  // An integer number, between 1 and 31
  const lastDayInMonth = getLastDayInMonth(currentDate);
  const monthLastDayIndex = monthFirstDayIndex + lastDayInMonth - 1;

  const calendarDays = [...Array(CELLS_IN_MONTH)].map((_, dayIndex) => {
    const isNotMonthDay = dayIndex < monthFirstDayIndex || dayIndex > monthLastDayIndex;
    if (isNotMonthDay) {
      return undefined;
    }
    const isWeekend = isWeekendIndex(dayIndex, monthFirstDayIndex);

    return {
      day: dayIndex - monthFirstDayIndex + 1,
      isWeekend,
    };
  });

  const calendarDaysNodes = document.querySelectorAll(".month__day");

  calendarDays.map((day, index)=> {
    const dayNode = calendarDaysNodes[index];
    if (!day) {
      dayNode.innerHTML = "";
    } else {
      dayNode.innerHTML = day.day;
      if (day.isWeekend) {
        dayNode.classList.add("month__day--weekend");
      }
    }
  });
}

initializeCalendar();
