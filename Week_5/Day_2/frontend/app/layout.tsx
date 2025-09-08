import "./globals.css";
export const metadata = { title: 'Realtime Comments', description: 'NestJS + Next.js Realtime Comment System' };
import { ReduxProvider } from "../lib/providers";
import { Toaster } from 'react-hot-toast';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="container py-6">
        <ReduxProvider>
            <header className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Realtime Comments</h1>
            </header>
            {children}
          <Toaster
            position="top-center"
            toastOptions={{
              className: "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-lg px-4 py-3",
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}