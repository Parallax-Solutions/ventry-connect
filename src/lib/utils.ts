import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a client's full name from first + last name parts */
export const formatClientName = (client: { firstName: string; lastName: string }) =>
  `${client.firstName} ${client.lastName}`;
