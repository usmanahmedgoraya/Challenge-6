"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ColorRing } from "react-loader-spinner";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function PatientForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [valueDoc, setValue] = useState({
        name: "",
        email: "",
        password: "",
        age: 0,
        gender: "",
    });
    const onSavePatientProfile = async e => {
        e.preventDefault();
        if (valueDoc.name.trim() === "" || valueDoc.email.trim() === "" || valueDoc.password.trim() === "" || valueDoc.age.trim() === "" || valueDoc.gender.trim() === "") {
            return alert("Invalid credentials entered!");
        };
        try {

            setLoading(true);
            // send request here....
            const data = await fetch("/api/register/patient", {
                method: "POST",
                body: JSON.stringify({
                    name: valueDoc.name,
                    email: valueDoc.email,
                    password: valueDoc.password,
                    age: valueDoc.age,
                    gender: valueDoc.gender
                })
            });
            const resp = await data.json();
            if (!resp.success) {
                toast.error('User is already existed', {
                    position: "top-right",
                    autoClose: 1300,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                    transition: Bounce,
                });
                return console.log("user Already existed")
            }
            toast.success('Patient Account is Created Successfully', {
                position: "top-right",
                autoClose: 1300,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
            });
            router.push("/");
            setLoading(false)
            console.log(resp);
        } catch (error) {
            console.log(error)
        }
        finally {
            setLoading(false)
        }
    };
    const onClear = () => {
        setValue({
            name: "",
            email: "",
            password: "",
            age: 0,
            gender: "male",
        });
        router.push("/choice");
    };
    const onChangeState = event => {
        const { name, value } = event.target;
        setValue({
            ...valueDoc,
            [name]: value
        });
    }
    return <>
        <ToastContainer />
        <form className="sm:w-1/2 mx-auto px-2 xl:w-[700px]" onSubmit={onSavePatientProfile}>
            <div class="space-y-12">
                <div class="border-b border-gray-900/10 pb-12">
                    <h2 class="text-base font-semibold leading-7 text-gray-900 text-center">Patient Profile</h2>
                    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div class="sm:col-span-12">
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
                            <div class="mt-2">
                                <input onChange={onChangeState} name="name" type="text" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" value={valueDoc.name} />
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                            <div class="mt-2">
                                <input onChange={onChangeState} id="email" name="email" type="email" value={valueDoc.email} class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                            <div class="mt-2">
                                <input value={valueDoc.password} onChange={onChangeState} id="email" name="password" type="password" autocomplete="email" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                        <div class="sm:col-span-4">
                            <label for="country" class="block text-sm font-medium leading-6 text-gray-900">Gender</label>
                            <div class="mt-2 w-full">
                                <select value={valueDoc.gender} onChange={onChangeState} id="country" name="gender" autocomplete="country-name" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6">
                                    <option value="" >Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div class="sm:col-span-2 sm:col-start-1">
                            <label for="city" class="block text-sm font-medium leading-6 text-gray-900">Age</label>
                            <div class="mt-2">
                                <input value={valueDoc.age} onChange={onChangeState} type="number" min="20" name="age" id="city" autocomplete="address-level2" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-6 flex items-center justify-end gap-x-6">
                <button onClick={onClear} type="button" class="text-sm font-semibold leading-6 text-gray-900">Cancel</button>
                <button type="submit" class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex justify-center" disabled={loading}>
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
                        Regitering...
                    </span> : "Register"}
                </button>
            </div>
        </form>
    </>
};