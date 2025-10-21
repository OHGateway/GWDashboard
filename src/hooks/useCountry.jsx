import { useSearchParams } from "react-router-dom";

export const useCountry = (defaultCountry = "KR") => {
  const [searchParams] = useSearchParams();
  return searchParams.get("country") || defaultCountry;
};
