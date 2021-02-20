import {
  differenceInCalendarDays,
  format as dateFnsFormat,
  isSameDay,
} from "date-fns";
import locale from "date-fns/locale/fi";

type DateFormatOptions = {
  formatString?: string;
  isFirstLetterUpperCase?: boolean;
};

class DateUtil {
  static defaultFormatOptions = {
    formatString: "dd.MM.yyyy",
    isFirstLetterUpperCase: true,
  };

  static format(date: Date | string, options?: DateFormatOptions): string {
    const { formatString, isFirstLetterUpperCase } = {
      ...DateUtil.defaultFormatOptions,
      ...options,
    };

    const dateConverted = typeof date === "string" ? new Date(date) : date;
    let formattedString = dateFnsFormat(dateConverted, formatString, {
      locale,
    });
    // Convert first letter of string to uppercase
    if (isFirstLetterUpperCase && formattedString.length > 0) {
      formattedString =
        formattedString[0].toUpperCase() + formattedString.slice(1);
    }
    return formattedString;
  }

  static dateIsIn(date: Date, dates: Date[]): boolean {
    return dates.some((it) => isSameDay(it, date));
  }

  static getDateStreak(dates: Date[]): number {
    const sortedDates = dates.sort((a, b) => b.getTime() - a.getTime());
    const todayToLastMarkDiff = differenceInCalendarDays(
      new Date(),
      sortedDates[0]
    );
    if (todayToLastMarkDiff > 1) return 0; // If latest date isnt today or yesterday, return 0

    let streakLength = 1;
    for (let i = 1; i < sortedDates.length; i += 1) {
      const differenceToNextMarking = Math.abs(
        differenceInCalendarDays(sortedDates[i], sortedDates[i - 1])
      );
      if (differenceToNextMarking === 1) streakLength += 1;
      else return streakLength;
    }
    return streakLength;
  }
}

export default DateUtil;
