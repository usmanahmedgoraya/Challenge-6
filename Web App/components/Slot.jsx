"use client"
import { useContext, useState } from 'react';

import { useClinicContext } from '@/context/clinicContext';
import { ColorRing } from 'react-loader-spinner';
function Slot({ appointment, index, }) {
  const [selectedStartTime, setSelectedStartTime] = useState(appointment.startTime);
  const [selectedEndTime, setSelectedEndTime] = useState(appointment.endTime);
  const [status, setStatus] = useState(appointment.status);
  const [loading, setLoading] = useState(false)


  const { socket } = useContext(useClinicContext);
  const deleteAppointment = async (id) => {
    try {
      setLoading(true)
      const deleteApp = await fetch("/api/appointments/" + id, {
        method: "DELETE"
      });
      const res = await deleteApp.json();
      // Emit the socket flag
      let roomId = 12
      socket.emit("abc", roomId);
      console.log("deleted", res);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };
  return (
    <tr className="border-b dark:border-neutral-500">
      <td className="whitespace-nowrap px-4 py-4 font-medium">{index + 1}</td>
      <td className="whitespace-nowrap px-4 py-4">{appointment.startTime}</td>
      <td className="whitespace-nowrap px-4 py-4">{appointment.endTime}</td>
      <td className="whitespace-nowrap px-4 py-4">{appointment.status}</td>
      {/* <td className="whitespace-nowrap px-4 py-4 "><span> <EditSlots selectedStartTime={selectedStartTime} selectedEndTime={selectedEndTime} status={status} /></span></td> */}
      <td className="whitespace-nowrap px-4 py-4"><button onClick={() => deleteAppointment(appointment._id)} className='bg-red-500 px-2 py-1 text-white rounded cursor-pointer' disabled={loading}>
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
            Deleting...
          </span> : "Delete"}</button></td>
    </tr>
  )
}

export default Slot