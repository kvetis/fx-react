import styled, { css } from "styled-components";
import { Rate } from "./model";
import Decimal from "decimal.js";
import { useState } from "react";

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(8rem, 1fr));
  grid-gap: 1rem;
`;

export const Box = styled.div<{ $x2?: boolean }>`
  background-color: #35323233;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  line-height: 1.5;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0px 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  ${({ $x2 }) =>
    $x2 &&
    css`
      grid-column: span 2;
    `}
`;

export const Lighter = styled.span`
  color: #fffc;
`;

export const ExchangeRate = ({ rate }: { rate: Rate }) => {
  return (
    <Box>
      <div>
        <Lighter>{rate.amount.toString()}</Lighter>
        {rate.code}
      </div>
      <div>
        {rate.rate.toFixed(3)}
        <Lighter>CZK</Lighter>
      </div>
    </Box>
  );
};

export const ExchangeRatesGrid = ({ rates }: { rates: Rate[] }) => {
  return (
    <Grid>
      {rates.map((rate) => (
        <ExchangeRate key={rate.code} rate={rate} />
      ))}
      <ExchangeForm rates={rates} key="form" />
    </Grid>
  );
};

export const Input = styled.input`
  border: none;
  background-color: transparent;
  font-size: inherit;
  color: inherit;
  font-family: inherit;
  outline: none;
  text-align: right;
  /* border-bottom: currentColor solid 1px; */
  text-decoration: underline;
  text-underline-offset: 0.2em;
  flex-shrink: 1;
  height: 1.5em;
  min-width: 0;
`;

export const Select = styled.select`
  appearance: none;
  background-color: transparent;
  border: none;
  font-size: inherit;
  color: inherit;
  font-family: inherit;
  outline: none;
  /* border-bottom: currentColor solid 1px; */
  text-decoration: underline;
  text-underline-offset: 0.2em;
  text-align: right;
  line-height: inherit;
  height: 1.5em;
  cursor: pointer;
`;

export const Label = styled.label`
  display: flex;
  align-items: end;
  max-width: 100%;
  overflow: hidden;
`;

export const ExchangeForm = ({ rates }: { rates: Rate[] }) => {
  const [amount, setAmount] = useState(new Decimal(100));
  const [currency, setCurrency] = useState(rates[0]);
  const cost = amount
    .dividedBy(currency.rate)
    .times(currency.amount)
    .toDecimalPlaces(4 - currency.amount.sd(true));

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setAmount(new Decimal(event.target.value).toDecimalPlaces(3));
    } catch (error) {
      // Ignore invalid input
    }
  };

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrency(rates.find(({ code }) => event.target.value === code)!);
  };

  const show2x = cost.sd(true) > 5 || amount.sd(true) > 5;

  return (
    <Box $x2={show2x}>
      <Label>
        <Input
          type="number"
          value={amount.toString()}
          onChange={handleAmountChange}
        />
        <Lighter>CZK</Lighter>
      </Label>

      <Label>
        <div>{cost.toString()}</div>
        <Select value={currency.code} onChange={handleCurrencyChange}>
          {rates.map((rate) => (
            <option value={rate.code} key={rate.code}>
              {rate.code}
            </option>
          ))}
        </Select>
      </Label>
    </Box>
  );
};
