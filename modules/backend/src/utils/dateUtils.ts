import { Marking } from "@prisma/client";
import { format } from "date-fns";
import locale from "date-fns/locale/fi";

// Return date in ISO format with correct Timezone. Because toISOString() returns +00, need this for +02 timezone.
export const formatIsoString = (date: Date | string): string => {
  const dateConverted = typeof date === "string" ? new Date(date) : date;
  const formatted = format(dateConverted, "yyyy-MM-dd'T'HH:mm:ssxxx", {
    locale,
  });
  return formatted;
};

// Return latest marking of markings array
export const getLatestMarking = (markings: Marking[]): Marking | null => {
  const sortedMarkings = markings.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return sortedMarkings[0] || null;
};

// Return latest marking of markings array
export const getEarliestMarking = (markings: Marking[]): Marking | null => {
  const sortedMarkings = markings.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  return sortedMarkings[sortedMarkings.length - 1] || null;
};
