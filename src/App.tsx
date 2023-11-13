import React from "react";
import "./App.css";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { fetchRates } from "./model";
import { ExchangeRatesGrid } from "./Components";

const queryClient = new QueryClient();

function App() {
  return (
    <div>
      <h1>MomEx</h1>
      <QueryClientProvider client={queryClient}>
        <Rates />
      </QueryClientProvider>
    </div>
  );
}

function Rates() {
  const {
    isLoading,
    error,
    data: rates,
  } = useQuery({
    queryKey: ["rates"],
    queryFn: fetchRates,
  });

  return (
    <div>
      {isLoading ? (
        "Loading..."
      ) : error || !rates ? (
        <span>Could not load rates: {error?.message ?? ""}</span>
      ) : (
        <ExchangeRatesGrid rates={rates} />
      )}
    </div>
  );
}

export default App;
