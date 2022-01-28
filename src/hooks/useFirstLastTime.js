import { useEffect, useState } from "react";
import { formattedTimestamp } from "../functions";

const useFirstLastTime = (appointments) => {
  const [result, setResult] = useState({
    timeOfFirstAppointment: "",
    timeOfLastAppointment: "",
  });

  useEffect(() => {
    if (appointments) {
      appointments.sort((a, b) => {
        return a.timeOfAppointment - b.timeOfAppointment;
      });

      const copyAppointments = [...appointments];

      const timeOfFirstAppointment = formattedTimestamp(copyAppointments.shift()?.timeOfAppointment);

      const timeOfLastAppointment = formattedTimestamp(copyAppointments.pop()?.timeOfAppointment);

      setResult({
        timeOfFirstAppointment,
        timeOfLastAppointment,
      });
    }
  }, [appointments]);

  return result;
};

export default useFirstLastTime;
