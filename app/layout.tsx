import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';

import ThemeProvider from './components/ThemeProvider';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sale Domain',
  description: 'Make an Offer For this Domain',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <html lang="en" className="dark">
      <body className={roboto.className + " bg-gray-900 text-gray-200"} >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
