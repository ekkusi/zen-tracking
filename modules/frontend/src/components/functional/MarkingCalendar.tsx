import { Tag } from "@chakra-ui/react";
import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { addHours, isAfter, isBefore, isSameDay } from "date-fns";
import React, { useEffect, useRef, useState } from "react";

import {
  CalendarProps,
  CalendarTileProperties,
  DateCallback,
} from "react-calendar";
import DateUtil from "util/DateUtil";
import usePrimaryColor from "../../hooks/usePrimaryColor";
import { ParsedChallengeParticipation } from "../../types/parsedBackendTypes";
import UserInfoUtil from "../../util/UserInfoUtil";

import Calendar from "../general/Calendar";
import EditMarking, { EditType } from "./EditMarking";

type CalendarPropTypes = CalendarProps & {
  participation: Omit<ParsedChallengeParticipation, "markings"> & {
    markings: Marking[];
  };
  onEdit?: (marking: Marking, type: EditType) => void;
  isEditable?: boolean;
};

const DEFAULT_MIN_DATE = new Date("2021-01-01");
const DEFAULT_MAX_DATE = new Date();

const MarkingCalendar = ({
  participation,
  isEditable = true,
  onEdit,
  ...rest
}: CalendarPropTypes): JSX.Element => {
  const unmounted = useRef(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [markingInEdit, setMarkingInEdit] = useState<Marking | null>();
  const [dateInEdit, setDateInEdit] = useState<Date | null>();

  const primaryColor = usePrimaryColor();

  const { markings } = participation;

  const getTileContent = ({ date, view }: CalendarTileProperties) => {
    if (view === "month") {
      if (
        DateUtil.dateIsIn(
          date,
          markings.map((it) => new Date(it.date))
        )
      ) {
        if (
          DateUtil.dateIsIn(
            date,
            markings.map((it) => new Date(it.date))
          )
        ) {
          return (
            <Tag
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              borderRadius="50%"
              background={primaryColor}
              w="40px"
              h="40px"
            />
          );
        }
      }
    }
    return null;
  };

  const tileClassName = ({ date, view }: CalendarTileProperties) => {
    const classNames = [];
    // Add class to tiles in month view only
    if (view === "month") {
      // Check if a date React-Calendar wants to check is on the list of dates to add class to
      const isMarked = DateUtil.dateIsIn(
        date,
        markings.map((it) => new Date(it.date))
      );
      if (isMarked) {
        classNames.push("react-calendar__tile--marked");
      }
      if (dateInEdit && isSameDay(dateInEdit, date)) {
        classNames.push("react-calendar__tile--custom-active");
      }
      if (isMarked && UserInfoUtil.getNextDayMarking(date, markings)) {
        classNames.push("react-calendar__tile--next-day-marked");
      }
      if (isMarked && UserInfoUtil.getPrevDayMarking(date, markings)) {
        classNames.push("react-calendar__tile--prev-day-marked");
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

  const getMaxDate = () => {
    const participationEndDateString = participation.endDate;
    const participationEndDate = participationEndDateString
      ? new Date(participationEndDateString)
      : null;

    if (
      participationEndDate &&
      isBefore(participationEndDate, DEFAULT_MAX_DATE)
    ) {
      return participationEndDate;
    }
    return DEFAULT_MAX_DATE;
  };

  console.log(`Max date: ${getMaxDate()}`);
  console.log(
    participation.startDate
      ? new Date(participation.startDate)
      : DEFAULT_MIN_DATE
  );

  return (
    <>
      <EditMarking
        marking={markingInEdit}
        date={dateInEdit}
        hasOpenButton={false}
        isOpen={!!isEditOpen}
        onEdit={onEdit}
        onClose={() => {
          if (!unmounted.current) {
            setMarkingInEdit(null);
            setIsEditOpen(false);
            setDateInEdit(null);
          }
        }}
      />
      <Calendar
        tileClassName={tileClassName}
        onClickDay={onClickDay}
        maxDate={getMaxDate()}
        minDate={
          participation.startDate
            ? new Date(participation.startDate)
            : DEFAULT_MIN_DATE
        }
        defaultActiveStartDate={
          isAfter(getMaxDate(), new Date()) ? new Date() : getMaxDate()
        }
        tileDisabled={() => !isEditable}
        tileContent={getTileContent}
        {...rest}
      />
    </>
  );
};

export default MarkingCalendar;
