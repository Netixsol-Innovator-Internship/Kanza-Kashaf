'use client';
import { useState } from 'react';
import { useLoginMutation, useSignupMutation } from '../../lib/api';
import { useDispatch } from 'react-redux';
import { setToken } from '../../lib/authSlice';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [login] = useLoginMutation();
  const [signup] = useSignupMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const submit = async (e:any) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        const res = await login({ identifier, password }).unwrap();
        dispatch(setToken(res.accessToken));
        router.push('/');
      } else {
        const res = await signup({ username, email, password }).unwrap();
        dispatch(setToken(res.accessToken));
        router.push('/');
      }
    } catch (e:any) {
      alert(e?.data?.message || 'Failed');
    }
  };

  return (
    <div className="card max-w-md mx-auto space-y-4">
      <div className="flex gap-2">
        <button
          className={`btn ${mode==='login'?'bg-indigo-600':'bg-gray-600'}`}
          onClick={()=>setMode('login')}
        >
          Login
        </button>
        <button
          className={`btn ${mode==='signup'?'bg-indigo-600':'bg-gray-600'}`}
          onClick={()=>setMode('signup')}
        >
          Signup
        </button>
      </div>
      <form className="space-y-3" onSubmit={submit}>
        {mode==='signup' && (
          <input
            className="input"
            placeholder="Username"
            value={username}
            onChange={e=>setUsername(e.target.value)}
          />
        )}
        {mode==='signup' && (
          <input
            className="input"
            placeholder="Email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
          />
        )}
        {mode==='login' && (
          <input
            className="input"
            placeholder="Email or Username"
            value={identifier}
            onChange={e=>setIdentifier(e.target.value)}
          />
        )}
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
        />
        <button className="btn w-full" type="submit">
          {mode==='login'?'Login':'Create account'}
        </button>
      </form>
      <Link className="underline" href="/">← Back</Link>
    </div>
  );
}
