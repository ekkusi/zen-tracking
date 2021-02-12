import { Tag } from "@chakra-ui/react";
import { Marking } from "@ekeukko/zen-tracking-backend/lib/types/user";
import { isSameDay } from "date-fns";
import React from "react";
import ReactCalendar, {
  CalendarProps,
  CalendarTileProperties,
} from "react-calendar";
import styled from "styled-components";

const StyledCalendar = styled(ReactCalendar)`
  width: 100%;

  .react-calendar {
    &__tile {
      &:hover {
        background: ${({ theme }) => theme.colors.primary.light};
      }
      &--now {
        background: ${({ theme }) => theme.colors.primary.regular};
        &:hover {
          background: ${({ theme }) => theme.colors.primary.light};
        }
      }
      &--marked {
        background: ${({ theme }) => theme.colors.secondary.regular};
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
      console.log(date, markings);
      if (markings.some((it) => isSameDay(new Date(it.date), new Date(date)))) {
        return "react-calendar__tile--marked";
      }
    }
    return null;
  };

  const tileContent = ({ date, view }: CalendarTileProperties) => {
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      console.log(date, markings);
      if (markings.some((it) => isSameDay(new Date(it.date), new Date(date)))) {
        return <Tag colorScheme="teal">{date.toISOString()}</Tag>;
      }
    }
    return null;
  };

  return (
    <StyledCalendar
      tileClassName={tileClassName}
      tileContent={tileContent}
      {...rest}
    />
  );
};

export default Calendar;
