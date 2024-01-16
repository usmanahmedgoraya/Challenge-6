"use client"
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";

import { GrSchedules } from "react-icons/gr";
import { FaCheckToSlot } from "react-icons/fa6";
import { RiMapPinTimeLine } from "react-icons/ri";
import { AiFillMedicineBox } from "react-icons/ai";
import { useClinicContext } from "@/context/clinicContext";
import { useSession } from "next-auth/react";

const DashboardCard = () => {
    const { data: session } = useSession()
    const { socket } = useContext(useClinicContext);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false)
    const [TotalAppointment, setTotalAppointment] = useState("")
    const [availableSlot, setAvailableSlot] = useState("")
    const [totalSlot, setTotalSlot] = useState("")

    useEffect(() => {
        getSlots();
    }, [])

    const getSlots = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/appointments/${session.user.loggedUser._id}`);
            const slotsData = await response.json();
            console.log(slotsData.data)
            const TotalAppointment = slotsData?.data?.filter(appoint => appoint.status === "Reserved").length;
            const AvailableSlot = slotsData?.data?.filter(appoint => appoint.status === "Not Reserved").length
            const totalSlots = slotsData?.data?.length
    
            setTotalAppointment(TotalAppointment);
            setTotalSlot(totalSlots)
            setAvailableSlot(AvailableSlot);
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
        <div className="p-4">
            <p className="text-5xl font-bold text-center mb-8">Dashboard</p>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <Card
                    title="Appointments"
                    subtitle={TotalAppointment}
                    href="#"
                    Icon={GrSchedules}
                />
                <Card title="Available Slots" subtitle={availableSlot} href="#" Icon={FaCheckToSlot} />
                <Card title="Total Slots" subtitle={totalSlot} href="#" Icon={RiMapPinTimeLine} />
                
            </div>
        </div>
    );
};

const Card = ({ title, subtitle, Icon, href }) => {
    return (
        <Link
            href={href}
            className="w-full p-4 rounded border-[1px] border-slate-300 relative overflow-hidden group bg-white flex flex-col justify-center items-center"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

            <Icon className="absolute z-10 -top-12 -right-12 text-9xl text-slate-100 group-hover:text-violet-400 group-hover:rotate-12 transition-transform duration-300" />
            <Icon className="mb-2 text-2xl text-violet-600 group-hover:text-white transition-colors relative z-10 duration-300" />
            <h3 className="font-medium text-lg text-slate-950 group-hover:text-white relative z-10 duration-300 text-center">
                {title}
            </h3>
            <p className="text-slate-400 text-center group-hover:text-violet-200 relative z-10 duration-300 text-6xl font-semibold mt-4">
                {subtitle}
            </p>
        </Link>
    );
};

export default DashboardCard;