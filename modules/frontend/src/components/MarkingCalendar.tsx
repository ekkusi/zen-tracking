import { Marking } from "@ekeukko/zen-tracking-backend/lib/types/user";
import { isSameDay } from "date-fns";
import React from "react";
import ReactCalendar, {
  CalendarProps,
  CalendarTileProperties,
} from "react-calendar";
import styled from "styled-components";
import DateUtil from "util/DateUtil";

const StyledCalendar = styled(ReactCalendar)`
  width: 100%;

  .react-calendar {
    &__tile {
      padding: ${({ theme }) => `${theme.space[4]} ${theme.space[2]}`};

      position: relative;
      & > abbr {
        display: block;
      }
      &:hover {
        background: ${({ theme }) => theme.colors.primary.light};
        color: ${({ theme }) => theme.colors.white};
      }
      &--now {
        background: ${({ theme }) => theme.colors.white};
        &:hover {
          background: ${({ theme }) => theme.colors.primary.light};
        }
      }
      &--marked {
        &:after {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          content: "\u2715"; /* use the hex value here... */
          font-size: 50px;
          color: ${({ theme }) => theme.colors.black};
          text-align: center;
        }
      }
      &--active {
        background: ${({ theme }) => theme.colors.primary.regular};
        &:hover {
          background: ${({ theme }) => theme.colors.primary.light};
        }
        &:enabled {
          background: ${({ theme }) => theme.colors.primary.regular};
        }
      }
      &:disabled {
        background: ${({ theme }) => theme.colors.gray[100]};
        pointer-events: none;
      }
    }
    &__month-view {
      &__days__day {
        color: ${({ theme }) => theme.colors.black};
        &--weekend {
          color: ${({ theme }) => theme.colors.black};
        }
      }
    }
    &__navigation {
      & button {
        &:hover,
        &:enabled:hover {
          background: ${({ theme }) => theme.colors.primary.light};
        }
        &:disabled {
          background: ${({ theme }) => theme.colors.gray[100]};
          pointer-events: none;
        }
      }
      & button:enabled {
        background: ${({ theme }) => theme.colors.white};
      }
    }
  }
`;

type CalendarPropTypes = CalendarProps & {
  markings: Marking[];
};

const Calendar = ({ markings, ...rest }: CalendarPropTypes): JSX.Element => {
  const tileClassName = ({ date, view }: CalendarTileProperties) => {
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (
        DateUtil.dateIsIn(
          date,
          markings.map((it) => new Date(it.date))
        )
      ) {
        return "react-calendar__tile--marked";
      }
    }
    return null;
  };

  return (
    <StyledCalendar
      tileClassName={tileClassName}
      formatMonth={(locale, date) =>
        DateUtil.format(date, { formatString: "LLLL" })
      }
      formatMonthYear={(locale, date) =>
        DateUtil.format(date, { formatString: "LLLL yyyy" })
      }
      maxDate={new Date()}
      minDate={new Date("2021-01-01")}
      locale="fi-FI"
      {...rest}
    />
  );
};

export default Calendar;
