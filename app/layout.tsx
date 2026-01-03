import type React from "react"
import "./globals.css"
import ClientLayout from "./ClientLayout"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}

export const metadata = {
  metadataBase: 'https://themyown.vercel.app',
  title: {
    default: 'MyOwn - Your All-in-One Productivity Solution',
    template: '%s | MyOwn'
  },
  description: 'Transform your productivity with MyOwn - the comprehensive platform for task management, resource organization, focus timers, goal tracking, and performance analytics. Boost efficiency and achieve your goals.',
  keywords: ['productivity', 'task management', 'goal tracking', 'focus timer', 'resource library', 'workspace', 'organization', 'efficiency', 'analytics', 'todo list'],
  authors: [{ name: 'MyOwn Team' }],
  creator: 'MyOwn',
  publisher: 'MyOwn',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/fav.svg',
    apple: '/fav.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://myown.com/',
    siteName: 'MyOwn',
    title: 'MyOwn - Your All-in-One Productivity Solution',
    description: 'Transform your productivity with MyOwn - the comprehensive platform for task management, resource organization, focus timers, goal tracking, and performance analytics.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MyOwn Productivity Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyOwn - Your All-in-One Productivity Solution',
    description: 'Transform your productivity with MyOwn - the comprehensive platform for task management, resource organization, focus timers, goal tracking, and performance analytics.',
    images: ['/og-image.png'],
    creator: '@myownapp',
  },
  other: {
    'script': [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "MyOwn",
          applicationCategory: "ProductivityApplication",
          description: "Your all-in-one productivity solution for seamless task management, resource organization, and performance tracking.",
          url: "https://myown.com/",
          creator: {
            "@type": "Organization",
            name: "MyOwn Team"
          },
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1000"
          }
        })
      }
    ]
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
