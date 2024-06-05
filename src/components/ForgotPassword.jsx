import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making API requests
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const sendResetPasswordEmail = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/sendResetPasswordEmail`, {
        email: email
      });
      if (response.status === 200){
        setIsEmailSent(true); 
        toast.success('Email sent successfully! Please check your inbox.');
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  


  const resetPassword = async () => {
    try {
      const response = await axios.post('${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/resetPassword', {
        email: email,
        otpCode: otp,
        password: newPassword
      });

      if( response.status === 200) {
        toast.success('Password reset successfully! Please login with your new password.');
        localStorage.clear();
        router.push('/auth/login');
      } 
    } catch (error) {
        toast.error('Invalid OTP code! Please try again.');
      setError(error.response.data.message);
    }
  };

  return (
    <div>
      {!isEmailSent ? (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">Reset Password</h3>
          </div>
          <div className="p-7">
            <form onSubmit={(e) => { e.preventDefault(); sendResetPasswordEmail(); }}>
              <label className="mb-2.5 block font-medium text-black dark:text-white">Email</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              <div className="flex justify-end items-end mt-4">
                <button
                  className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                  type="submit"
                >
                  Verify Email
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-7 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">Reset Password</h3>
            </div>
            <div className="p-7">
              <form onSubmit={(e) => { e.preventDefault(); resetPassword(); }}>
              <label className="mb-2.5 block font-medium text-black dark:text-white">Email</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
              
                <label className="mb-2.5 block font-medium text-black dark:text-white">OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <label className="mt-4 mb-2.5 block font-medium text-black dark:text-white">New Password</label>
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <div className="flex justify-end items-end mt-4">
                  <button
                    className="flex justify-center rounded bg-primary px-6 py-2 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                  >
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
