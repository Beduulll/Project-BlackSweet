export const formatRupiah = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

export const formatWeight = (value: number): string =>
  `${value.toLocaleString("id-ID", { maximumFractionDigits: 2 })} kg`;

const parseDate = (value: string): Date =>
  value.length === 10
    ? new Date(`${value}T00:00:00`)
    : new Date(`${value.replace(" ", "T")}Z`);

export const formatDate = (value?: string | null): string => {
  if (!value) return "-";
  const date = parseDate(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export const todayISO = (): string => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
};
