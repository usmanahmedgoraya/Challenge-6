/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import DoctorList from '@/components/DoctorList'
import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '@/components/Sidebar';
import { useClinicContext } from '@/context/clinicContext';
function doctorList() {
    // Declare useStates
    const [doctorList, setdoctorList] = useState([]);
    const { socket } = useContext(useClinicContext);
    const [loading, setLoading] = useState(false)

    // Fetching on Component mount
    useEffect(() => {
        getAllDoctors();
    }, []);

    // Function for the fetching data
    const getAllDoctors = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/register/doctor');
            const data = await res.json();
            setdoctorList(data);
            setLoading(false)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }


    // Socket is Listening
    useEffect(() => {
        if (socket) {
            socket.on("refetch", (roomId) => {
                getAllDoctors();
            });
        }
    }, []);

    return (
        <div className='lg:ml-64 sm:ml-44 space-y-2 p-3 overflow-hidden'>
            <Sidebar />
            <DoctorList doctorList={doctorList} loading={loading} />
        </div>
    )
}

export default doctorList;
