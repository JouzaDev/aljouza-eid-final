import './globals.css';
import { IBM_Plex_Sans_Arabic } from 'next/font/google';

// استدعاء خط IBM Plex Sans Arabic بأوزان مختلفة
const ibm = IBM_Plex_Sans_Arabic({ 
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// التعديل هنا: إضافة أيقونة الإيموجي الاحتفالية
export const metadata = {
  title: 'أفراح العيد | منصة الجوزاء',
  description: 'تهاني العيد من منصة الجوزاء',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎉</text></svg>',
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