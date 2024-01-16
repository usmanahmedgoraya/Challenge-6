"use client"
import React, { useState, useEffect, useContext, use } from 'react';
import EditSlots from './EditSlots';
import Slot from './Slot';
import { useClinicContext } from '@/context/clinicContext';
import { io } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { ColorRing } from 'react-loader-spinner';




export default function Slots({ }) {
  const { data: session } = useSession()
  const { socket } = useContext(useClinicContext);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getSlots();
  }, [])

  const getSlots = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/appointments/${session.user.loggedUser._id}`);
      const slotsData = await response.json();
      console.log(slotsData.data)
      setSlots(slotsData.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false)
    }
  };


  // Listening the Socket
  useEffect(() => {
    if (socket) {
      socket.on("refetch", (roomId) => {
        getSlots();
      });
    }
  }, []);


  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              <thead className="border-b font-medium dark:border-neutral-500">
                <tr>
                  <th scope="col" className="px-4 py-4">#</th>
                  <th scope="col" className="px-4 py-4">Start Time</th>
                  <th scope="col" className="px-4 py-4">End Time</th>
                  <th scope="col" className="px-4 py-4">Status</th>
                  {/* <th scope="col" className="px-4 py-4">Modify</th> */}
                  <th scope="col" className="px-4 py-4">Action</th>
                </tr>
              </thead>
              <tbody>

                {slots?.map((app, i) => <Slot key={app._id} index={i} appointment={app} />)}
              </tbody>
            </table>
            {loading ? <div className='flex justify-center items-center mt-4'>
              <ColorRing
                visible={true}
                height="80"
                width="80"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper"
                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
              />
            </div> : (slots?.length === 0 && <div className='text-center mt-4'>No appointment yet!</div>)
            }
          </div>
        </div>
      </div>
    </div>
  );
}