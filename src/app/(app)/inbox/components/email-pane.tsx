import AccountModal from '@/app/(app)/inbox/components/account-modal';
import CustomModal from '@/app/(app)/inbox/components/custom-modal';
import { useInbox } from '@/app/(app)/inbox/contexts';
import { AntdParagraph, AntdTitle } from '@/components/antd';
import { RiDice3Line, RiEditLine, RiSaveLine } from '@remixicon/react';
import { useResponsive } from 'ahooks';
import { Button, Skeleton, Tooltip } from 'antd';
import React, { useState } from 'react';

const EmailPane: React.FC = () => {
  const [customOpen, setCustomOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { loading, currentEmail, onRandom } = useInbox();
  const responsive = useResponsive();
  return (
    <>
      <div className="flex justify-between items-center bg-gray-50 p-4 md:p-5 lg:p-6 rounded-2xl">
        <div className="">
          <AntdParagraph type="secondary" className="text-xs mb-2">
            当前邮箱
          </AntdParagraph>
          {loading ? (
            <Skeleton.Input active size="small" />
          ) : (
            <AntdTitle
              level={responsive.lg ? 3 : 4}
              className="m-0"
              copyable={!!currentEmail?.full_address}
            >
              {currentEmail?.full_address || '暂无可用邮箱'}
            </AntdTitle>
          )}
        </div>
        <div className="lg:space-x-2">
          <Tooltip title="随机邮箱">
            <Button
              disabled={loading}
              shape="circle"
              type="text"
              className="leading-none"
              icon={<RiDice3Line size={20} />}
              onClick={() => onRandom(currentEmail?.domain.domain)}
            />
          </Tooltip>
          <Tooltip title="自定义邮箱">
            <Button
              disabled={loading}
              shape="circle"
              type="text"
              className="leading-none"
              icon={<RiEditLine size={20} />}
              onClick={() => setCustomOpen(true)}
            />
          </Tooltip>
          <Tooltip title="保存账号">
            <Button
              disabled={loading}
              shape="circle"
              type="text"
              className="leading-none"
              icon={<RiSaveLine size={20} />}
              onClick={() => setAccountOpen(true)}
            />
          </Tooltip>
        </div>
      </div>
      <CustomModal open={customOpen} setOpen={setCustomOpen} />
      <AccountModal open={accountOpen} setOpen={setAccountOpen} />
    </>
  );
};

export default EmailPane;
