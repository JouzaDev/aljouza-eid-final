import type { Metadata } from 'next';
import './globals.css';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';

const ibm = IBM_Plex_Sans_Arabic({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'أفراح العيد | منصة الجوزاء',
  description: 'تهاني العيد من منصة الجوزاء',
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🎉%3C/text%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={ibm.className}>{children}</body>
    </html>
  );
}