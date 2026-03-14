import './globals.css';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';

// استدعاء خط IBM Plex Sans Arabic بأوزان مختلفة
const ibm = IBM_Plex_Sans_Arabic({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata = {
  title: 'أفراح العيد | منصة الجوزاء',
  description: 'تهاني العيد من منصة الجوزاء',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      {/* تطبيق الخط على كامل الموقع */}
      <body className={ibm.className}>{children}</body>
    </html>
  );
}