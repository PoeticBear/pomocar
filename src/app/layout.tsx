import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'POMODORO CAR - Creative Pomodoro Timer with Driving Animation',
  description: 'POMODORO CAR is an innovative Pomodoro timer featuring a beautiful night city view and driving car animation. Boost your productivity with this 25-minute focus timer.',
  keywords: 'pomodoro timer, productivity tool, focus timer, work timer, POMODORO CAR, creative timer',
  openGraph: {
    title: 'POMODORO CAR - Creative Pomodoro Timer',
    description: 'Enhance your work sessions with a beautiful night city view and driving car animation. Make your Pomodoro technique more engaging.',
    images: [
      {
        url: 'https://pomodorocar.com/preview-image.jpg',
        width: 1200,
        height: 630,
        alt: 'POMODORO CAR Preview',
      },
    ],
    url: 'https://pomodorocar.com/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'POMODORO CAR - Creative Pomodoro Timer',
    description: 'Enhance your work sessions with a beautiful night city view and driving car animation.',
    images: ['https://pomodorocar.com/preview-image.jpg'],
  },
  robots: 'index, follow',
  alternates: {
    canonical: 'https://pomodorocar.com/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-KH1822KE21" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KH1822KE21');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
