import type { VercelRequest, VercelResponse } from "@vercel/node";
import { ApiRate } from "../src/model";

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const res = await fetch(
      "https://www.cnb.cz/en/financial-markets/foreign-exchange-market/central-bank-exchange-rate-fixing/central-bank-exchange-rate-fixing/daily.txt"
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
    const rates: ApiRate[] = lines
      .slice(2)
      .map(
        (line) => line.split("|") as [string, string, string, string, string]
      )
      .filter((props) => props.length === 5)
      .map(([country, currency, amount, code, rate]) => ({
        country,
        currency,
        amount,
        code,
        rate,
      }));

    response.status(200).json(rates);
  } catch (error) {
    response.status(500).json({ error });
  }
}
