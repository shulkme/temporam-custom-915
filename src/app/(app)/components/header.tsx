'use client';
import { AntdHeader } from '@/components/antd';
import Logo from '@/icons/logo';
import { RiMenuLine } from '@remixicon/react';
import { useLocalStorageState, useResponsive } from 'ahooks';
import { Alert, Button } from 'antd';
import React from 'react';

const Header: React.FC = () => {
  const responsive = useResponsive();
  const [bannerHide, setBannerHide] =
    useLocalStorageState<boolean>('banner-hide');
  const handleSider = () => {
    window.dispatchEvent(new CustomEvent('global:sider:open'));
  };

  return (
    !responsive.lg && (
      <AntdHeader className="sticky top-0 z-50">
        {!bannerHide && (
          <Alert
            type="info"
            banner
            message="保存书签到手机桌面方便下次快速使用！"
            closeIcon={<a>不再提醒</a>}
            onClose={() => setBannerHide(true)}
          />
        )}
        <div className="flex items-center justify-between h-16 px-4 bg-gray-50">
          <div className="flex items-center gap-2 text-xl font-bold">
            <span className="text-(--ant-color-primary)">
              <Logo width={24} height={24} />
            </span>
            <span>{process.env.NEXT_PUBLIC_APP_NAME}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="text"
              size="small"
              className="leading-none"
              icon={<RiMenuLine size={20} />}
              onClick={handleSider}
            />
          </div>
        </div>
      </AntdHeader>
    )
  );
};

export default Header;
