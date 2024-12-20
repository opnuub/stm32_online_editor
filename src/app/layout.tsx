import type { Metadata } from "next";
import localFont from "next/font/local";
import "./bootstrap.min.css"

import Header from "./components/Header";
import { Container } from 'react-bootstrap'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "龙菲校服",
  description: "龙菲社官网",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"></link>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        <Container className="my-3">{children}</Container>
      </body>
    </html>
  );
}
