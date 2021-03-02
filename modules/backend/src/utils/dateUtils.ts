import { format } from "date-fns";

// Return date in ISO format with correct Timezone. Because toISOString() returns +00, need this for +02 timezone.
export const formatIsoString = (date: Date): string => {
  const dateConverted = typeof date === "string" ? new Date(date) : date;
  return format(dateConverted, "yyyy-MM-dd HH:mm:ssx");
};
