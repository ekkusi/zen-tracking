import { Marking } from "@ekkusi/zen-tracking-backend/lib/types/schema";
import { addHours, isSameDay } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import {
  CalendarProps,
  CalendarTileProperties,
  DateCallback,
} from "react-calendar";
import DateUtil from "util/DateUtil";
import Calendar from "../general/Calendar";
import EditMarking from "./EditMarking";

type CalendarPropTypes = CalendarProps & {
  markings: Marking[];
  isEditable?: boolean;
};

const MIN_DATE = new Date("2021-01-01");
const MAX_DATE = new Date();

const MarkingCalendar = ({
  markings,
  isEditable = true,
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
      <Calendar
        tileClassName={tileClassName}
        onClickDay={onClickDay}
        maxDate={MAX_DATE}
        minDate={MIN_DATE}
        tileDisabled={() => !isEditable}
        {...rest}
      />
    </>
  );
};

export default MarkingCalendar;
