'use client';
import {
  AntdContent,
  AntdFooter,
  AntdHeader,
  AntdLayout,
  AntdSider,
} from '@/components/antd';
import Logo from '@/icons/logo';
import { RiTelegram2Fill } from '@remixicon/react';
import { useResponsive } from 'ahooks';
import { Button } from 'antd';
import Image from 'next/image';
import React from 'react';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const responsive = useResponsive();

  return (
    <AntdLayout className="min-h-screen" hasSider={responsive.lg}>
      {responsive.lg && (
        <AntdSider
          collapsible
          breakpoint="lg"
          collapsedWidth={0}
          theme="light"
          width={'35%'}
          className="bg-gray-50 relative"
          trigger={null}
        >
          <div className="flex items-center gap-2 text-xl font-bold p-8 relative z-50 text-white">
            <span className="text-(--ant-color-primary)">
              <Logo width={20} height={20} />
            </span>
            <span>{process.env.NEXT_PUBLIC_APP_NAME}</span>
          </div>
          <Image fill src="/images/sso.jpg" alt="" className="object-cover" />
        </AntdSider>
      )}
      <AntdLayout>
        <AntdHeader>
          <div className="flex justify-end items-center p-8">
            <Button
              href={process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM}
              target="_blank"
              type="link"
              className="leading-none"
              icon={<RiTelegram2Fill size={20} />}
            >
              联系客服
            </Button>
          </div>
        </AntdHeader>
        <AntdContent className="flex flex-col items-center justify-center">
          <div className="max-w-lg w-full mx-auto p-6">{children}</div>
        </AntdContent>
        <AntdFooter>
          <div className="text-sm text-black/50 text-center p-4">
            © {process.env.NEXT_PUBLIC_COPYRIGHT} {new Date().getFullYear()}
          </div>
        </AntdFooter>
      </AntdLayout>
    </AntdLayout>
  );
}
