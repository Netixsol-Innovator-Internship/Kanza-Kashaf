'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import LoginHeader from '../components/headers/LoginHeader';
import AuthToggle from '../components/AuthToggle';
import Navbar2 from '../components/navbars/Navbar2';

// 🔑 import RTK Query hook + store + api slice
import { useLoginMutation } from '../../store/api';
import { store } from '../../store/store';
import { api } from '../../store/api';

type LoginForm = {
  email: string;
  password: string;
  remember?: boolean;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const router = useRouter();
  const [login, { isLoading }] = useLoginMutation();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    try {
      // call login API
      const result = await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      // ✅ Save token
      try {
        if (result.accessToken) {
          localStorage.setItem('token', result.accessToken);
        }
      } catch (e) {
        console.warn('Failed to save token to localStorage', e);
      }

      // ✅ Save user to localStorage (if returned)
      try {
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
      } catch (e) {
        console.warn('Failed to save user to localStorage', e);
      }

      // 🔁 Invalidate RTK Query cache for the current user so components using
      // getProfile (tagged as { type: 'User', id: 'ME' }) will refetch with the new token.
      try {
        store.dispatch(api.util.invalidateTags([{ type: 'User', id: 'ME' }]));
      } catch (e) {
        // keep this warning lightweight — cache invalidation failing shouldn't block login
        console.warn('Failed to invalidate user cache:', e);
      }

      // redirect to home/dashboard
      router.push('/');
    } catch (err: any) {
      console.error('Login failed:', err);
      alert(err?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <Navbar2 />
      <LoginHeader />
      <div className="flex justify-center items-center pt-6">
        <AuthToggle />
      </div>

      <div className="flex items-center justify-center px-4 py-8 pb-16">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-md bg-white shadow-md rounded-xl px-8 py-10"
        >
          {/* Title */}
          <h1 className="text-center text-xl font-semibold text-[#2B3674]">
            Log In
          </h1>
          <p className="text-center text-sm text-gray-400 mt-2">
            New member?{' '}
            <a href="/register" className="text-[#2B3674] font-medium hover:underline">
              Register Here
            </a>
          </p>

          {/* Email */}
          <div className="mt-8">
            <label className="text-sm text-[#2B3674]">Enter Your Email*</label>
            <input
              {...register('email', { required: true })}
              type="email"
              className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B3674]"
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="text-sm text-[#2B3674]">Password*</label>
            <div className="relative">
              <input
                type={passwordVisible ? 'text' : 'password'}
                {...register('password', { required: true })}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B3674]"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('remember')}
                className="w-4 h-4"
              />
              <span className="text-xs text-gray-500">Remember me</span>
            </label>
            <a href="/forgot" className="text-xs text-[#2B3674] hover:underline">
              Forget Password
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2B3674] text-white text-sm font-medium py-2 rounded mt-6 hover:bg-[#1f285d] transition disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>

          {/* Social Login */}
          <p className="text-center text-sm text-[#2B3674] mt-6">Or Register With</p>
          <div className="flex justify-center space-x-6 mt-4">
            <button
              type="button"
              className="w-10 h-10 rounded-full border flex items-center justify-center"
            >
              <img src="/images/google.png" alt="Google" className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full border flex items-center justify-center"
            >
              <img src="/images/facebook.png" alt="Facebook" className="w-3 h-5" />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full border flex items-center justify-center"
            >
              <img src="/images/twitter.png" alt="Twitter" className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
