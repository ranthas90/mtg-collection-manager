import {clsx} from "clsx";
import {twMerge} from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatEuroCurrency(data) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(data);
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
