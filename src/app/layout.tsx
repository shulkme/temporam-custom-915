import NProgressBar from '@/app/components/nprogress-bar';
import ClarityProvider from '@/providers/clarity';
import { IdentityProvider } from '@/providers/identity';
import { ThemeProvider } from '@/providers/theme';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import { App } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import React from 'react';
import './globals.css';
dayjs.locale('zh-cn');

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  appleWebApp: {
    title: process.env.NEXT_PUBLIC_APP_NAME,
  },
  applicationName: process.env.NEXT_PUBLIC_APP_NAME,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = cookies().get('themeMode')?.value || 'auto';
  return (
    <html lang="en" className={theme} suppressHydrationWarning>
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      <body>
        <ClarityProvider>
          <AntdRegistry>
            <NProgressBar
              options={{
                showSpinner: false,
              }}
            />
            <ThemeProvider initMode={theme}>
              <App>
                <IdentityProvider>{children}</IdentityProvider>
              </App>
            </ThemeProvider>
          </AntdRegistry>
        </ClarityProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
    </html>
  );
}
