import { useEffect, useState } from "react";
import { formattedTimestamp } from "../functions";

const useSumTips = (appointments) => {
  const [result, setResult] = useState(0);

  useEffect(() => {
    const sum = appointments.reduce((prevVal, currVal) => prevVal + currVal.tips, 0);
    setResult(sum);
  }, [appointments]);

  return result;
};

export default useSumTips;
