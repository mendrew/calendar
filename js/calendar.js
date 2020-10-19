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

function getLastDayInMonthDate(date) {
  const lastDayInMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return lastDayInMonthDate;
}

// An integer number, between 1 and 31
function getLastDayInMonth(date) {
  const lastDayInMonthDate = getLastDayInMonthDate(date); 
  return lastDayInMonthDate.getDate();
}


function constructCalendarDays(date) {
  const monthFirstDayIndex = getWeekDayOfFirstDayInMonth(date);

  // An integer number, between 1 and 31
  const lastDayInMonth = getLastDayInMonth(date);
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

  return calendarDays;
}

function renderCalendarCells(calendarDays) {
  const calendarDaysNodes = document.querySelectorAll(".month__day");

  if (calendarDaysNodes.length !== calendarDays.length) {
    return;
  }

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
    dayNode.classList.remove("month__day--loading");
  });
}

function renderCalendarTitle(date) {
  const monthString = new Intl.DateTimeFormat('en-US', { month: 'long'}).format(date);
  const year = date.getFullYear();

  const calendarTitle = document.querySelector(".month__title");
  if (!calendarTitle) {
    return;
  }

  calendarTitle.innerHTML = `${monthString} ${year}`;
  calendarTitle.classList.remove("month__title--loading");
}

function renderCalendarMonth(date) {
  const calendarDays = constructCalendarDays(date);
  renderCalendarCells(calendarDays);
  renderCalendarTitle(date);
  setCurrentMonthToDOM(date);
}

function setCurrentMonthToDOM(currentDate) {
  const monthElement = document.querySelector(".calendar__month");
  if (!monthElement) {
    return;
  }

  monthElement.dataset.currentMonth = currentDate.getTime();
}

function getCurrentMonthFromDOM() {
  const monthElement = document.querySelector(".calendar__month");
  if (!monthElement) {
    return;
  }

  const currentDateTimeStamp =  monthElement.dataset.currentMonth;
  return new Date(+currentDateTimeStamp);
}

function changeMonthHandler(event) {
  const currentDate = getCurrentMonthFromDOM();
  if (!currentDate) {
    return;
  }

  const navigationElement = event.currentTarget;
  const isPreviousMonth = navigationElement.classList.contains("calendar__month-navigation--previous");

  const currentMonthLastDayDate = getLastDayInMonthDate(currentDate);
  let newMonthDate = new Date(currentDate);
  if (isPreviousMonth) {
    newMonthDate.setDate(0);
  } else {
    newMonthDate = new Date(
      currentMonthLastDayDate.getFullYear(),
      currentMonthLastDayDate.getMonth(),
      currentMonthLastDayDate.getDate() + 1
    );
  }

  renderCalendarMonth(newMonthDate);
}

function attachMonthChangeHandlers() {
  const navigationButtons = document.querySelectorAll(".calendar__month-navigation");
  for (let buttonIndex = 0; buttonIndex < navigationButtons.length; buttonIndex++) {
    navigationButtons[buttonIndex].addEventListener("click", changeMonthHandler);
  }
}

function initializeCalendar() {
  const currentDate = new Date();

  attachMonthChangeHandlers();
  renderCalendarMonth(currentDate);
}

initializeCalendar();
