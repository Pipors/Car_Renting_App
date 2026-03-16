import { format } from "date-fns";

export const formatCurrency = (value: string | number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(value));

export const formatDate = (value: string | Date) => format(new Date(value), "MMM d, yyyy");

export const formatName = (firstName: string, lastName: string) => `${firstName} ${lastName}`;
