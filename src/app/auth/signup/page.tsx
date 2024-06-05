"use client";
import React, { useState } from "react";
import Link from "next/link";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rollNo, setRollNo] = useState("");

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {

      //  Check if email is from @chitrakoota.com domain
       if (!email.toLowerCase().endsWith('@chitrakoota.com')) {
        toast.error("Please use a valid @chitrakoota.com email address.");
        setLoading(false);
        return;
      }



      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.toLowerCase(),
            password,
            first_name,
            last_name: last_name || " ",
            roll_no: Number(rollNo), 
          }), 
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "You will receive OTP in another 5 mins. Your patience is appreciated till then!",
        );
        router.push("/auth/signin");
      } else {
        toast.error(`Registration failed: ${data.error}`);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gradient-background-dark">
      <Toaster />
      <div className="min-h-screen md:px-20">
        <div className="absolute top-0 px-2 py-4">
          <Image
            src="/images/logo/logo_light.png"
            alt="logo"
            width={250}
            height={100}
            className="hidden object-contain dark:block"
          />
          <Image
            src="/images/logo/logo_dark.png"
            alt="logo"
            width={250}
            height={100}
            className="object-contain dark:hidden"
          />
        </div>
        <div className="flex h-screen w-full items-center justify-center px-10">
          <div className="hidden w-1/2 px-20 md:flex">
            <Image
              src="/images/loginImage.png"
              alt="signin"
              width={500}
              height={500}
              className="object-contain"
            />
          </div>
          <div className="flex w-full flex-col gap-y-10 lg:w-1/2">
            <div className="w-full font-sansita text-[30px] font-extrabold text-white md:text-[50px]">
              Create new account .
            </div>
            <div className="font-poppins text-[18px]">
              <p>
                Already have an account?{" "}
                <Link
                  href="/auth/signin"
                  className="font-semibold text-[#B140FF] hover:underline"
                >
                  Sign In
                </Link>
              </p>
            </div>
            <form onSubmit={handleSubmit} className="md:w-[550px]">
              <div className="flex justify-between space-x-2">
                <div className="relative mb-8 rounded-xl border bg-[#3A3939]">
                  {/* <label className="block px-4 text-[10px] font-medium text-white/50">
                    First Name
                  </label> */}
                  <div className="">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full rounded-lg border-none bg-transparent px-4 pt-3 text-[18px]  text-white outline-none placeholder:text-[16px] focus:border-primary  focus-visible:shadow-none dark:border-form-strokedark dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        width="22"
                        height="22"
                        fill="#ffffff"
                      >
                        <g opacity="0.5">
                          <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="relative mb-8 rounded-xl border bg-[#3A3939]">
                  
                  <div className="">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                      
                      className="w-full rounded-lg border-none bg-transparent px-4 py-3 text-[18px] text-white outline-none focus:border-primary  focus-visible:shadow-none dark:border-form-strokedark dark:focus:border-primary"
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        width="22"
                        height="22"
                        fill="#ffff"
                      >
                        <g opacity="0.5">
                          <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative mb-8 rounded-xl border bg-[#3A3939]">
                <div className="">
                  {/* <label className="block px-4 text-[10px] font-medium text-white/50">
                    Employee Id
                  </label> */}
                  <input
                    type="number"
                    placeholder="1234"
                    value={rollNo}
                    maxLength={6}
                    onChange={(e) => setRollNo(e.target.value)}
                    required
                    className="w-full rounded-lg border-none bg-transparent px-4 py-3 text-[18px] text-white outline-none focus:border-primary  focus-visible:shadow-none dark:border-form-strokedark dark:focus:border-primary"
                  />
                </div>
                <span className="absolute right-4 top-3">
                  <svg
                    className="fill-current text-white"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.5">
                      <path
                        d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                        fill=""
                      />
                    </g>
                  </svg>
                </span>
              </div>


              <div className="relative mb-8 rounded-xl border bg-[#3A3939]">
                <div className="">
                  {/* <label className="block px-4 text-[10px] font-medium text-white/50">
                    Email
                  </label> */}
                  <input
                    type="email"
                    placeholder="abc@chitrakoota.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border-none bg-transparent px-4 py-3 text-[18px] text-white outline-none focus:border-primary  focus-visible:shadow-none dark:border-form-strokedark dark:focus:border-primary"
                  />
                </div>
                <span className="absolute right-4 top-3">
                  <svg
                    className="fill-current text-white"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g opacity="0.5">
                      <path
                        d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                        fill=""
                      />
                    </g>
                  </svg>
                </span>
              </div>

              <div className="relative mb-8 rounded-xl border bg-[#3A3939]">
                <div className="">
                  {/* <label className="block px-4 text-[10px] font-medium text-white/50">
                    Password
                  </label> */}
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="**********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border-none bg-transparent px-4 py-3 text-[18px] text-white outline-none focus:border-primary  focus-visible:shadow-none dark:border-form-strokedark dark:focus:border-primary placeholder:mt-10"
                  />

                  <span className="absolute right-4 top-3">
                    <svg
                      className="fill-current text-white"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g opacity="0.5">
                        <path
                          d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                          fill=""
                        />
                        <path
                          d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                          fill=""
                        />
                      </g>
                    </svg>
                  </span>
                </div>
              </div>

              <div className="mb-8 mt-4 text-white dark:text-white">
                <div className="flex">
                  <input
                    type="checkbox"
                    className=" right-4 w-4 text-black"
                    onChange={() => setShowPassword(!showPassword)}
                  />
                  <span className="ml-2">Show password</span>
                </div>
              </div>

              <div className="relative flex items-center justify-center md:justify-end">
                {loading ? (
                  <div className="mt-5 flex w-[90%] cursor-pointer items-center justify-center rounded-full border border-primary bg-gradient-to-r from-violet-600 to-[#B140FF] p-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-opacity-90 md:w-[30%]">
                    Creating
                  </div>
                ) : (
                  <input
                    type="submit"
                    value="CREATE ACCOUNT"
                    className="mt-5 w-[90%] cursor-pointer rounded-full border border-primary bg-gradient-to-r from-violet-600 to-[#B140FF] p-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-opacity-90 md:w-[40%]"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
