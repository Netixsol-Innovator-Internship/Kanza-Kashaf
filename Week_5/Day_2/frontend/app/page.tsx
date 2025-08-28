'use client';
import { Provider } from 'react-redux';
import store from '../lib/store';
import HomeUI from '../components/HomeUI';
export default function Page() {
  return <Provider store={store}><HomeUI /></Provider>;
}
