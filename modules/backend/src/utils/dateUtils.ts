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
