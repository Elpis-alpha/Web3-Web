import './styles/global.css'
import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import AppProvider from '@/source/components/general/AppProvider'
import Header from '@/source/components/general/Header'

const poppins = Poppins({
  weight: ["200", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: 'Web3 Training',
  description: 'Web3 Training',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#EFF6FC"></meta>
      </head>
      <body className={`${poppins.variable} font-poppins tracking-wide`}>
        <AppProvider>
          <Header />
          {children}
        </AppProvider>
      </body>
    </html>
  )
}