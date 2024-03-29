"use client"
import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";
import { useClinicContext } from '@/context/clinicContext';
import { ColorRing } from "react-loader-spinner";

const AppointmentList = ({ appointment, index }) => {
  const { socket } = useContext(useClinicContext);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false)


  const oncheckedReservation = async () => {
    try {
      setLoading(true)
      const data = await fetch("/api/register/doctor/" + session?.user?.loggedUser?._id, {
        method: "PUT",
        body: JSON.stringify({ appointmentId: appointment._id })
      })
      if (data.status === 200) {
        let roomId = 12
        socket.emit("abc", roomId);
      }
      const resp = data.json()
      setLoading(false)
      console.log(resp)

    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  };



  return (
    <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
      <th
        scope="row"
        class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {appointment?.Patients[0].name}
      </th>
      <td class="px-6 py-4">{appointment.startTime}</td>
      <td class="px-6 py-4">{appointment.endTime}</td>

      <td class="px-6 py-4 space-x-2">
        <span className="px-2 py-0 rounded-full bg-green-600"></span>
        <span>{appointment.status}</span>
      </td>
      <td class="px-6 py-4">
        <button onClick={oncheckedReservation} className="bg-green-600 rounded p-3 text-white" disabled={loading}>
          {loading ? <span className="flex items-center">
            <ColorRing
              visible={true}
              height="20"
              width="20"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
            />
            Checked...
          </span> : "Checked"}
        </button>
      </td>
    </tr>
  );
};

export default AppointmentList;
