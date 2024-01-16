"use client"
import React, { useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import io from "socket.io-client";
import { useClinicContext } from '@/context/clinicContext';
import { ColorRing } from 'react-loader-spinner';
// let socket = io("http://localhost:3001");
// import socket from '@/context/socket';

function Doctor({ doctor, index }) {
    const { data: session } = useSession();
    const [value, setValue] = useState("0");
    const [isLoading, setLoading] = useState(false)

    const { socket } = useContext(useClinicContext);
    const onSelectSlot = e => {

        setValue(e.target.value);
    };
    const onReserveSlot = async () => {
        if (value === "0") {
            return alert("invalid");
        };

        try {
            setLoading(true)
            const reserve = await fetch("/api/register/patient/" + session?.user?.loggedUser?._id, {
                method: "PUT",
                body: JSON.stringify({
                    appointmentId: value,
                }),
            });
            // Emitting the Socket request with flag
            let roomId = 12
            socket.emit("abc", roomId);
            const resp = await reserve.json();
            setLoading(false)
            console.log(resp)
        } catch (error) {

        }
    };

    const notReserved = doctor?.Appointments?.filter(a => a.status === "Not Reserved");

    return (
        <tr className="border-b dark:border-neutral-500" key={doctor._id}>
            <td className="whitespace-nowrap px-6 py-4 font-medium">{index + 1}</td>
            <td className="whitespace-nowrap px-6 py-4">{doctor.name}</td>
            <td className="whitespace-nowrap px-6 py-4">{doctor.qualification}</td>
            <td className="whitespace-nowrap px-6 py-4">{doctor.exp} years</td>
            <td className="whitespace-nowrap px-6 py-4">{doctor.amount} Rs</td>
            <td className="whitespace-nowrap px-6 py-4">
                <select value={value} onChange={onSelectSlot} name="slot" id="slot">
                    <option>Select Slot</option>
                    {notReserved?.map(a => <option value={a._id} key={a._id}>{a.startTime} - {a.endTime}</option>)}
                    {doctor?.Appointments?.length === 0 && <option disabled={true} value="0">No Slot</option>}
                </select>
            </td>
            <td>
                <button onClick={onReserveSlot} disabled={isLoading} className='border px-2 py-1 bg-gray-100'>
                    {isLoading ? <span className='flex items-center' >
                        <ColorRing
                            visible={true}
                            height="25"
                            width="25"
                            ariaLabel="color-ring-loading"
                            wrapperStyle={{}}
                            wrapperClass="color-ring-wrapper"
                            colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                        />
                        Reserving...
                    </span> : "Reserve"}
                </button>
            </td>
        </tr>

    )
}

export default Doctor