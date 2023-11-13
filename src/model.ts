import Decimal from "decimal.js";

export interface ApiRate {
  country: string;
  currency: string;
  amount: string;
  code: string;
  rate: string;
}

export interface Rate {
  country: string;
  currency: string;
  amount: Decimal;
  code: string;
  rate: Decimal;
}

export const fetchRates = async () => {
  const res = await fetch("/api/rates");
  const apiRates = (await res.json()) as ApiRate[];

  const rates: Rate[] = apiRates.map(({ amount, rate, ...other }) => ({
    ...other,
    amount: new Decimal(amount),
    rate: new Decimal(rate),
  }));
  return rates;
};
