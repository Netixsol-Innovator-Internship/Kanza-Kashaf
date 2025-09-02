'use client';
import { useForm, Controller } from 'react-hook-form';
import { useRegisterMutation } from '../../store/api';
import { useRouter } from 'next/navigation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import RegisterHeader from '../components/headers/RegisterHeader';
import AuthToggle from '../components/AuthToggle';
import Navbar2 from '../components/navbars/Navbar2';

export default function RegisterPage() {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [registerUser, { isLoading, error }] = useRegisterMutation();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const res = await registerUser(data).unwrap();
      console.log('Registered:', res);
      localStorage.setItem('token', res.accessToken);
      alert('Registration successful!');
      router.push('/');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <>
      <Navbar2 />
      <RegisterHeader />

      {/* Auth Toggle */}
      <div className="flex justify-center items-center pt-6">
        <AuthToggle />
      </div>

      {/* Registration Card */}
      <div className="flex items-center justify-center px-4 py-8 pb-16">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[592px] bg-white shadow-lg rounded-lg px-8 py-10"
        >
          {/* Title */}
          <h1 className="text-center text-xl font-semibold text-[#2B3674]">
            Register
          </h1>
          <p className="text-center text-sm text-gray-400 mt-2">
            Do you already have an account?{' '}
            <a href="/login" className="text-[#2B3674] font-medium hover:underline">
              Login Here
            </a>
          </p>

          {/* Personal Info */}
          <div className="mt-8">
            <h2 className="relative inline-block text-sm font-semibold text-[#2B3674] mb-3">
              Personal Information
              <span className="absolute left-0 -bottom-1 w-[50%] h-[3px] bg-[#F9C146] rounded-full"></span>
            </h2>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-[#2B3674]">Enter Your Full Name*</label>
                <input
                  {...register('fullName', { required: true })}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B3674]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#2B3674]">Enter Your Email*</label>
                  <input
                    {...register('email', { required: true })}
                    type="email"
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B3674]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#2B3674]">Enter Mobile Number*</label>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{
                      required: 'Phone number is required',
                      validate: (value) =>
                        /^[0-9]+$/.test(value) || 'Phone must contain only digits',
                    }}
                    render={({ field }) => (
                      <PhoneInput
                        country={'in'}
                        {...field}
                        inputStyle={{
                          width: '100%',
                          height: '40px',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                        buttonStyle={{ borderRadius: '6px 0 0 6px' }}
                        specialLabel=""
                      />
                    )}
                  />
                  {errors.phone?.message && (
                    <p className="text-red-500 text-xs mt-1">{String(errors.phone.message)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="mt-4">
            <h2 className="relative inline-block text-sm font-semibold text-[#2B3674] mb-3">
              Account Information
              <span className="absolute left-0 -bottom-1 w-[50%] h-[3px] bg-[#F9C146] rounded-full"></span>
            </h2>
            <div className="space-y-2">
              <div>
                <label className="text-sm text-[#2B3674]">Username*</label>
                <div className="relative mt-1">
                  <input
                    {...register("username", { required: true })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 pr-28 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B3674]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#2B3674] cursor-pointer underline underline-offset-4 decoration-1">
                    Check Availability
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-[#2B3674]">Password*</label>
                  <input
                    type="password"
                    {...register('password', { required: true, minLength: 6 })}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B3674]"
                  />
                </div>
                <div>
                  <label className="text-sm text-[#2B3674]">Confirm Password*</label>
                  <input
                    type="password"
                    {...register('confirmPassword', { required: true })}
                    className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B3674]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Captcha (Placeholder) */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-[#2B3674] mb-2">
              Prove You Are Human
            </h2>
            <div className="border border-gray-300 rounded-md flex items-center justify-center px-3 py-6">
              <div className="flex items-center space-x-2">
                <input type="checkbox" className="w-8 h-8 border border-gray-100" />
                <span className="text-sm font-bold text-[#2B3674]">I'm not a robot</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center space-x-2 mt-2">
            <input type="checkbox" className="w-4 h-4" />
            <label className="text-xs text-gray-500">
              I agree to the <span className="text-[#2B3674] cursor-pointer">Terms & Conditions</span>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#2B3674] text-white text-sm font-medium py-2 rounded mt-4 hover:bg-[#1f285d] transition"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Create Account'}
          </button>

          {error && <p className="text-red-500 text-sm mt-2">Failed to register</p>}

          {/* Social Login */}
          <p className="text-center text-sm text-[#2B3674] mt-6">Or Login With</p>
          <div className="flex justify-center space-x-6 mt-4">
            <button type="button" className="w-10 h-10 rounded-full border-2 flex items-center justify-center">
              <img src="/images/google.png" alt="Google" className="w-5 h-5" />
            </button>
            <button type="button" className="w-10 h-10 rounded-full border-2 flex items-center justify-center">
              <img src="/images/facebook.png" alt="Facebook" className="w-3 h-5" />
            </button>
            <button type="button" className="w-10 h-10 rounded-full border-2 flex items-center justify-center">
              <img src="/images/twitter.png" alt="Twitter" className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
