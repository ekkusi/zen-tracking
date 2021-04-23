import React from "react";
import styled from "styled-components";
import ReactCalendar, {
  CalendarProps as ReactCalendarProps,
} from "react-calendar";
import DateUtil from "../../util/DateUtil";
import usePrimaryColor from "../../hooks/usePrimaryColor";

type CalendarProps = ReactCalendarProps & {};

const StyledCalendar = styled(ReactCalendar)<
  CalendarProps & { primaryColor: string; lightPrimaryColor: string }
>`
  --color: ${({ theme }) => theme.colors.text.light};
  --bg-color: ${({ theme }) => theme.colors.white};
  --header-bg-color: ${({ primaryColor }) => primaryColor};
  --active-bg-color: ${({ primaryColor }) => primaryColor};
  --hover-bg-color: ${({ lightPrimaryColor }) => lightPrimaryColor};
  --hover-color: ${({ theme }) => theme.colors.white};
  --disabled-bg-color: ${({ theme }) => theme.colors.gray[100]};
  --disabled-text-color: ${({ theme }) => theme.colors.gray[400]};

  width: 100%;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.dark};
  color: var(--color);
  overflow: hidden;
  border: none;

  .react-calendar {
    &__tile {
      padding: ${({ theme }) => `${theme.space[4]} ${theme.space[2]}`};

      position: relative;
      & > abbr {
        display: block;
        position: relative;
        z-index: 1;
      }
      &:hover {
        background: var(--hover-bg-color);
        color: var(--hover-color);
      }
      &--now {
        background: var(--bg-color);
        &:hover {
          background: var(--hover-bg-color);
        }
      }
      &--marked {
        & > abbr {
          color: ${({ theme }) => theme.colors.white};
        }
      }
      &:before,
      &:after {
        content: "";
        position: absolute;
        height: 40px;
        width: 50%;
        top: 50%;
        transform: translateY(-50%);
      }
      &:before {
        left: 0;
      }
      &:after {
        right: 0;
      }
      &--next-day-marked {
        &:after {
          background: var(--active-bg-color);
        }
      }
      &--prev-day-marked {
        &:before {
          background: var(--active-bg-color);
        }
      }
      &--active {
        background: var(--bg-color);
        &:hover,
        &:enabled:hover {
          background: var(--hover-bg-color);
        }
        &:enabled {
          background: var(---bg-color);
        }
      }
      &--custom-active {
        background: var(--active-bg-color);
        &:hover,
        &:enabled:hover {
          background: var(--hover-bg-color);
        }
        &:enabled {
          background: var(--active-bg-color);
        }
      }
      &:disabled {
        background: var(--disabled-bg-color);
        pointer-events: none;
        color: var(--disabled-text-color);
      }
    }
    &__month-view {
      &__days__day {
        color: var(--color);
        &--weekend {
          color: var(--color);
        }
      }
    }
    &__navigation {
      background: var(--header-bg-color);
      height: 60px;
      color: ${({ theme }) => theme.colors.white};
      &__prev-button {
        border-right: ${({ theme }) => theme.borders["1px"]};
      }
      &__next-button {
        border-left: ${({ theme }) => theme.borders["1px"]};
      }
      & button {
        min-width: 60px;
        background: var(--header-bg-color);
        &:hover,
        &:enabled:hover {
          background: var(--header-bg-color);
          opacity: 0.8;
        }
        &:disabled {
          background: var(--disabled-bg-color);
          pointer-events: none;
          color: var(--disabled-text-color);
        }
        &:focus {
          background: var(--header-bg-color);
        }
      }
    }
  }
`;

const Calendar = ({
  formatMonth = (locale, date) =>
    DateUtil.format(date, { formatString: "LLLL" }),
  formatMonthYear = (locale, date) =>
    DateUtil.format(date, { formatString: "LLLL yyyy" }),
  ...rest
}: CalendarProps): JSX.Element => {
  const primaryModeColor = usePrimaryColor();
  const lightPrimaryModeColor = usePrimaryColor("light");

  return (
    <StyledCalendar
      formatMonth={formatMonth}
      formatMonthYear={formatMonthYear}
      primaryColor={primaryModeColor}
      lightPrimaryColor={lightPrimaryModeColor}
      {...rest}
    />
  );
};

Calendar.defaultProps = {
  locale: "fi-FI",
  view: "month",
  prev2Label: null,
  next2Label: null,
};

export default Calendar;
