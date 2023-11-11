import Decimal from "decimal.js";

export interface Rate {
  country: string;
  currency: string;
  amount: Decimal;
  code: string;
  rate: Decimal;
}

export const fetchRates = async () => {
  const res = await fetch(
    /** CNB uses invalid Access-Control-Allow-Origin: apl.cnb.cz
     * so we would need to use a proxy to fetch the data.
     */
    //"https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt"
    "/daily.txt"
  );
  const text = await res.text();

  /**
   * Parsing this format:
   * 10 Nov 2023 #218
   * Country|Currency|Amount|Code|Rate
   * Australia|dollar|1|AUD|14.599
   *...
   */
  const lines = text.split("\n");
  const rates: Rate[] = lines
    .slice(2)
    .map((line) => line.split("|") as [string, string, string, string, string])
    .map(([country, currency, amount, code, rate]) => ({
      country,
      currency,
      amount: new Decimal(amount),
      code,
      rate: new Decimal(rate),
    }));

  return rates;
};
