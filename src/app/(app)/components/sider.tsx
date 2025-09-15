'use client';
import NavMenu from '@/app/components/nav-menu';
import { AntdSider } from '@/components/antd';
import Logo from '@/icons/logo';
import { useAuthorized } from '@/providers/authorized';
import {
  RiGlobalLine,
  RiGroupLine,
  RiInbox2Line,
  RiLogoutBoxRLine,
  RiSettingsLine,
} from '@remixicon/react';
import { Avatar, Button, ConfigProvider, Drawer, Tooltip } from 'antd';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Content = () => {
  const { user } = useAuthorized();

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="h-16 flex-none flex items-center gap-2 px-6 text-2xl font-bold">
          <span className="text-(--ant-color-primary)">
            <Logo width={24} height={24} />
          </span>
          <span>{process.env.NEXT_PUBLIC_APP_NAME}</span>
        </div>
        <div className="flex-auto overflow-auto">
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemMarginBlock: 8,
                  itemMarginInline: 16,
                  itemPaddingInline: 0,
                  iconMarginInlineEnd: 16,
                },
              },
            }}
          >
            <NavMenu
              className="border-r-0"
              mode="inline"
              inlineIndent={16}
              items={[
                {
                  label: '收信箱',
                  key: '/inbox',
                  icon: <RiInbox2Line size={18} />,
                },
                {
                  label: '账号',
                  key: '/accounts',
                  icon: <RiGroupLine size={18} />,
                },
                {
                  label: '域名',
                  key: '/domains',
                  icon: <RiGlobalLine size={18} />,
                },
                {
                  label: '设置',
                  key: '/settings',
                  icon: <RiSettingsLine size={18} />,
                },
              ]}
            />
          </ConfigProvider>
        </div>
        <div className="flex-none p-6 space-y-4">
          <div className="flex gap-4 items-center leading-none">
            <div className="flex-none">
              <Avatar
                size="small"
                className="border border-(--ant-color-primary-border) bg-(--ant-color-primary-bg) text-(--ant-color-primary) text-sm"
              >
                {user?.username.charAt(0).toUpperCase()}
              </Avatar>
            </div>
            <div className="flex-auto">
              <div className="font-medium line-clamp-1">{user?.username}</div>
            </div>
            <div className="flex-none">
              <Tooltip title="退出登录">
                <Button
                  href="/login"
                  type="text"
                  className="leading-none"
                  icon={<RiLogoutBoxRLine size={16} />}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Sider: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = () => {
      setOpen(true);
    };
    window.addEventListener('global:sider:open', handler);

    return () => {
      window.removeEventListener('global:sider:open', handler);
    };
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <AntdSider
        // theme="light"
        collapsible
        breakpoint="lg"
        width={240}
        collapsedWidth={0}
        trigger={null}
        className="invisible"
      />
      <AntdSider
        // theme="light"
        collapsible
        breakpoint="lg"
        width={240}
        collapsedWidth={0}
        trigger={null}
        className="fixed top-0 left-0 bottom-0 z-50 bg-slate-50"
      >
        <Content />
      </AntdSider>

      <Drawer
        width="320px"
        placement="left"
        open={open}
        onClose={() => setOpen(false)}
        closeIcon={null}
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <Content />
      </Drawer>
    </>
  );
};

export default Sider;
