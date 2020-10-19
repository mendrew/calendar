"use strict";

const CELLS_IN_MONTH = 35;
const CELLS_IN_EXTENDED_MONTH = 42;

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
  const numberOfCellsInMonth = monthLastDayIndex > CELLS_IN_MONTH
    ? CELLS_IN_EXTENDED_MONTH
    : CELLS_IN_MONTH;

  const calendarDays = [...Array(numberOfCellsInMonth)].map((_, dayIndex) => {
    const isNotMonthDay = dayIndex < monthFirstDayIndex || dayIndex > monthLastDayIndex;
    const isWeekend = isWeekendIndex(dayIndex, monthFirstDayIndex);

    const day = {
      value: isNotMonthDay ? undefined : dayIndex - monthFirstDayIndex + 1,
      isWeekend,
    };

    return day;
  });

  return calendarDays;
}

function renderCalendarCells(calendarDays) {
  const calendarDaysParent = document.querySelector(".month__body");
  if (!calendarDaysParent) {
    return;
  }

  const daysContainer = new DocumentFragment();
  calendarDays.map((day, index)=> {
    const dayNode = document.createElement('div');
    dayNode.classList.add("month__day");

    dayNode.innerHTML = day.value ? day.value : "";

    if (day.isWeekend) {
      dayNode.classList.add("month__day--weekend");
    }

    daysContainer.append(dayNode);
  });

  calendarDaysParent.innerHTML = '';
  calendarDaysParent.append(daysContainer);
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
