import { useEffect, useState } from "react";
import { formattedTimestamp } from "../functions";

const useFirstLastTime = (appointments) => {
  const [result, setResult] = useState({
    timeOfFirstAppointment: "",
    timeOfLastAppointment: "",
  });

  useEffect(() => {
    appointments.sort((a, b) => {
      return a.timeOfAppointment - b.timeOfAppointment;
    });

    const timeOfFirstAppointment = formattedTimestamp(appointments.shift()?.timeOfAppointment);

    const timeOfLastAppointment = formattedTimestamp(appointments.pop()?.timeOfAppointment);

    setResult({
      timeOfFirstAppointment,
      timeOfLastAppointment,
    });
  }, [appointments]);

  return result;
};

export default useFirstLastTime;
