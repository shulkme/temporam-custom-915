'use client';
import Header from '@/app/(app)/components/header';
import Sider from '@/app/(app)/components/sider';
import { AntdContent, AntdLayout } from '@/components/antd';
import React from 'react';

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <AntdLayout className="min-h-screen w-full" hasSider>
      <Sider />
      <AntdLayout>
        <Header />
        <AntdContent>{children}</AntdContent>
      </AntdLayout>
    </AntdLayout>
  );
}
