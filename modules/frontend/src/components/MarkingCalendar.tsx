import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { addHours, isSameDay } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import ReactCalendar, {
  CalendarProps,
  CalendarTileProperties,
  DateCallback,
} from "react-calendar";
import styled from "styled-components";
import DateUtil from "util/DateUtil";
import EditMarking from "./EditMarking";

const StyledCalendar = styled(ReactCalendar)`
  --color: ${({ theme }) => theme.colors.text.light};
  --bg-color: ${({ theme }) => theme.colors.white};
  --active-bg-color: ${({ theme }) => theme.colors.primary.regular};
  --hover-bg-color: ${({ theme }) => theme.colors.primary.light};
  --hover-color: ${({ theme }) => theme.colors.white};
  --disabled-bg-color: ${({ theme }) => theme.colors.gray[100]};

  width: 100%;
  border-radius: 10px;
  border-color: ${({ theme }) => theme.colors.gray[300]};
  color: vaR(--color);
  box-shadow: 3px 3px 5px -5px black;
  .react-calendar {
    &__tile {
      padding: ${({ theme }) => `${theme.space[4]} ${theme.space[2]}`};

      position: relative;
      & > abbr {
        display: block;
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
        &:after {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          content: "\u2715"; /* use the hex value here... */
          font-size: 50px;
          color: var(--color);
          text-align: center;
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
        opacity: 0.6;
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
      & button {
        &:hover,
        &:enabled:hover {
          background: var(--hover-bg-color);
        }
        &:disabled {
          background: var(--disabled-bg-color);
          pointer-events: none;
          opacity: 0.6;
        }
      }
      & button:enabled {
        background: var(--bg-color);
      }
    }
  }
`;

type CalendarPropTypes = CalendarProps & {
  markings: Marking[];
};

const MIN_DATE = new Date("2021-01-01");
const MAX_DATE = new Date();

const MarkingCalendar = ({
  markings,
  ...rest
}: CalendarPropTypes): JSX.Element => {
  const unmounted = useRef(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [markingInEdit, setMarkingInEdit] = useState<Marking | null>();
  const [dateInEdit, setDateInEdit] = useState<Date | null>();
  const tileClassName = ({ date, view }: CalendarTileProperties) => {
    const classNames = [];
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      if (
        DateUtil.dateIsIn(
          date,
          markings.map((it) => new Date(it.date))
        )
      ) {
        classNames.push("react-calendar__tile--marked");
      }
      if (dateInEdit && isSameDay(dateInEdit, date)) {
        classNames.push("react-calendar__tile--custom-active");
      }
    }
    return classNames;
  };

  useEffect(() => {
    return () => {
      unmounted.current = true;
    };
  }, []);

  const onClickDay: DateCallback = (date) => {
    // Convert clicked date to be at time 12:00 instead of 00:00 to make ISOString to give the same day instead of day before
    const midDayDate = addHours(date, 12);
    const markingMatch = markings.find((it) =>
      isSameDay(new Date(it.date), midDayDate)
    );
    setDateInEdit(midDayDate);
    if (markingMatch) {
      setMarkingInEdit(markingMatch);
    }
    setIsEditOpen(true);
  };

  return (
    <>
      <EditMarking
        marking={markingInEdit}
        date={dateInEdit}
        hasOpenButton={false}
        isOpen={!!isEditOpen}
        onClose={() => {
          if (!unmounted.current) {
            setMarkingInEdit(null);
            setIsEditOpen(false);
            setDateInEdit(null);
          }
        }}
      />
      <StyledCalendar
        tileClassName={tileClassName}
        formatMonth={(locale, date) =>
          DateUtil.format(date, { formatString: "LLLL" })
        }
        formatMonthYear={(locale, date) =>
          DateUtil.format(date, { formatString: "LLLL yyyy" })
        }
        onClickDay={onClickDay}
        maxDate={MAX_DATE}
        minDate={MIN_DATE}
        locale="fi-FI"
        {...rest}
      />
    </>
  );
};

export default MarkingCalendar;
