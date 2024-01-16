"use client";

import Link from "next/link";
import { useState } from "react";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ColorRing } from "react-loader-spinner";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userEmail = email;
      const userPassword = password;

      setLoading(true);

      const res = await signIn("credentials", {
        email: userEmail,
        password: userPassword,
        redirect: false,
      });

      if (res.ok) {
        // Fetch the session after successful sign-in
        const session = await getSession();

        // Check if the user is a doctor
        if (session?.user?.loggedUser?.isDoctor) {
          router.push("/dashboard");
        } else {
          // Redirect patients to the doctor-list page
          router.push("/doctor-list");
        }
      } else {
        // Handle authentication failure
        console.log("Authentication failed:", res.error);
      }

    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white shadow-md rounded-md p-8">

          <Image className="mx-auto h-12 w-auto" src="https://www.svgrepo.com/show/499664/user-happy.svg" alt="Icon" width={48} height={48} />

          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>


          <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Email</label>
              <div className="mt-1">
                <input name="email" type="email-address" autoComplete="email-address" required className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm" onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1">
                <input id="password" name="password" type="password" autoComplete="password" required className="px-2 py-3 mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-sky-500 focus:outline-none focus:ring-sky-500 sm:text-sm" onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div>
              <button type="submit"
                className="flex w-full justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2" disabled={loading}>
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
                  Singing in...
                </span> : "SignIn"}
              </button>
            </div>
            <Link className="text-sm mt-6 text-right" href={"/choices"}>
              Not Registered? <span className="underline">Register</span>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
