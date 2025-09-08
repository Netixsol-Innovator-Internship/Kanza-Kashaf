import './globals.css';
import { Providers } from '../store/provider';
import Navbar from './components/Navbar';
import NotificationsProvider from './components/NotificationsProvider';
import Footer from './components/Footer';

export const metadata = {
  title: 'My Shop',
  description: 'E-commerce project',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <NotificationsProvider>
              <Navbar />
              <main>
                {children}
              </main>
              <Footer />
          </NotificationsProvider>
        </Providers>
      </body>
    </html>
  );
}
