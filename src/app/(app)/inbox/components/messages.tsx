'use client';
import { getEmailList } from '@/api/email';
import { EmailRecord } from '@/api/email/types';
import { useInbox } from '@/app/(app)/inbox/contexts';
import { AntdList, AntdListItem } from '@/components/antd';
import { formatTimeWithTimezone } from '@/utils/time';
import { RiRefreshLine } from '@remixicon/react';
import { useCountDown, useRequest } from 'ahooks';
import { Button } from 'antd';
import React, { useEffect, useState } from 'react';

const Messages: React.FC = () => {
  const { currentEmail } = useInbox();
  const [emails, setEmails] = useState<EmailRecord[]>([]);
  const [nextRefreshTime, setNextRefreshTime] = useState<number>();

  // 刷新倒计时
  const [countDown] = useCountDown({
    targetDate: nextRefreshTime,
  });

  // 轮询消息
  const { loading, run, cancel, refresh } = useRequest(getEmailList, {
    manual: true,
    pollingInterval: 10000,
    pollingErrorRetryCount: 2,
    pollingWhenHidden: false, // 页面失活停止请求
    onSuccess: (res) => {
      const emails = res.data;
      setEmails(emails);
    },
    onFinally: () => {
      setNextRefreshTime(Date.now() + 10000);
    },
  });

  const handleClick = (id: string) => {
    window.dispatchEvent(
      new CustomEvent('mail:preview', {
        detail: id,
      }),
    );
  };

  useEffect(() => {
    cancel();
    if (currentEmail?.full_address) {
      run(currentEmail.full_address);
    }
  }, [currentEmail?.full_address]);

  return (
    <>
      <div className="border border-gray-100 p-4 md:p-5 lg:p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium">最新邮件</div>
          <div className="space-x-4 leading-none">
            <span className="text-xs text-black/50">
              {!loading && Math.round(countDown / 1000) + '秒后自动刷新'}
            </span>
            <Button
              loading={loading}
              type="text"
              size="small"
              className="leading-none"
              icon={<RiRefreshLine size={16} />}
              onClick={refresh}
            >
              刷新
            </Button>
          </div>
        </div>
        <AntdList
          dataSource={emails}
          renderItem={(email) => (
            <AntdListItem
              key={email.uuid}
              className="hover:bg-gray-100 cursor-pointer"
              onClick={() => handleClick(email.uuid)}
            >
              <div className="flex-auto space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">
                    {email.from_name || '未知联系人'}
                  </h4>
                  <span className="text-xs text-black/50">
                    {formatTimeWithTimezone(email.created_at, 'HH:mm')}
                  </span>
                </div>
                <div className="text-sm">{email.subject}</div>
                <div className="text-xs text-black/50 line-clamp-2">
                  {email.summary}
                </div>
              </div>
            </AntdListItem>
          )}
        />
      </div>
      <div className="text-center mt-2 text-xs text-black/50">
        <span>仅显示最近2个小时的邮件，过期自动删除。</span>
      </div>
    </>
  );
};

export default Messages;
