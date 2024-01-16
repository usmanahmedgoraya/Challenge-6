"use client";
import React, { useState, useEffect, useContext } from "react";
import AppointmentList from "./AppointmentList";
import { useSession } from "next-auth/react";
import { useClinicContext } from '@/context/clinicContext';
import { ColorRing } from "react-loader-spinner";

const Appointment = () => {
  const { data: session } = useSession()
  const [appointments, setAppointments] = useState([]);
  const { socket } = useContext(useClinicContext);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getSlots();
  }, []);

  const getSlots = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/appointments/${session?.user?.loggedUser?._id}`);
      const slotsData = await response.json();
      setAppointments(() => slotsData?.data?.filter(a => a?.status === "Reserved"));
      setLoading(false)
    } catch (error) {
      console.log(error);
    }
    finally {
      setLoading(false)
    }
  };

  // Listening Socket which is on when an event occurred
  useEffect(() => {
    if (socket) {
      socket.on("refetch", (roomId) => {
        getSlots();
      });
    }
  }, []);


  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Patient Name
              </th>
              <th scope="col" className="px-6 py-3">
                Start Time
              </th>
              <th scope="col" className="px-6 py-3">
                End Time
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments?.map((app, i) => (
              <AppointmentList key={app._id} index={i} appointment={app} />
            ))}
          </tbody>
        </table>
        {/* Add Loading */}
        {loading ? (<div className="flex justify-center items-center text-center mt-4">
          <ColorRing
            visible={true}
            height="80"
            width="80"
            ariaLabel="color-ring-loading"
            wrapperStyle={{}}
            wrapperclassName="color-ring-wrapper"
            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
          />
        </div>
        ) : (appointments?.length === 0 && <div className="text-center py-5 mx-auto w-full">No appointment yet!</div>)}

      </div>
    </div>
  );
};

export default Appointment;
