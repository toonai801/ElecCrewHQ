type EventDateRange = {
  eventDate: Date;
  eventEndDate?: Date | null;
};

export function formatEventDateRange(event: EventDateRange) {
  if (!event.eventEndDate) {
    return event.eventDate.toLocaleString();
  }

  return `${event.eventDate.toLocaleString()} - ${event.eventEndDate.toLocaleString()}`;
}

export function dateTimeLocalValue(date?: Date | null) {
  if (!date) {
    return "";
  }

  return date.toISOString().slice(0, 16);
}
