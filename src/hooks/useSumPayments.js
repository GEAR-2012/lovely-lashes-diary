import { useEffect, useState } from "react";

const useSumPayments = (appointments) => {
  const [result, setResult] = useState(0);

  useEffect(() => {
    const sum = appointments.reduce((prevVal, currVal) => prevVal + currVal.payment, 0);
    setResult(sum);
  }, [appointments]);

  return result;
};

export default useSumPayments;
