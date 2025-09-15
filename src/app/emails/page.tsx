'use client';
import { pullEmailDetail } from '@/api/email';
import { EmailRecord } from '@/api/email/types';
import PageContainer from '@/app/components/page-container';
import { AntdTitle } from '@/components/antd';
import HtmlRender from '@/components/html-render';
import { formatTimeWithTimezone } from '@/utils/time';
import { RiRefreshLine } from '@remixicon/react';
import { useCountDown, useRequest, useResponsive } from 'ahooks';
import { Alert, Avatar, Button, Card, Empty, Skeleton, Tooltip } from 'antd';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const [errMsg, setErrMsg] = useState<string>();
  const [record, setRecord] = useState<EmailRecord>();
  const params = useSearchParams();
  const code = params.get('code');
  const email = params.get('email');
  const [nextRefreshTime, setNextRefreshTime] = useState<number>();
  const responsive = useResponsive();

  // 刷新倒计时
  const [countDown] = useCountDown({
    targetDate: nextRefreshTime,
  });

  // 轮询消息
  const { loading, run, cancel, refresh } = useRequest(pullEmailDetail, {
    manual: true,
    pollingInterval: 10000,
    pollingErrorRetryCount: 2,
    pollingWhenHidden: false, // 页面失活停止请求
    onSuccess: (res) => {
      const email = res.data;
      if (email) {
        setRecord(email);
        cancel();
      }
      setErrMsg(undefined);
    },
    onFinally: () => {
      setNextRefreshTime(Date.now() + 10000);
    },
    onError: (e) => {
      setErrMsg(e.message || '获取失败');
    },
  });

  useEffect(() => {
    if (code && email) {
      run(code);
    } else {
      setErrMsg('无效链接');
    }
  }, [code, email, run]);

  return (
    <PageContainer title="收件箱" size="medium">
      <div className="space-y-6">
        {errMsg && <Alert type="warning" showIcon message={errMsg} />}
        <div className="flex justify-between items-center bg-gray-50 p-4 md:p-5 lg:p-6 rounded-2xl">
          <div>
            <AntdTitle
              className="m-0"
              copyable={!!email}
              level={responsive.lg ? 3 : 4}
            >
              {email || '无法解析邮箱地址'}
            </AntdTitle>
          </div>
          <div className="flex items-center gap-2">
            <div>
              <span className="text-xs text-black/50">
                {loading
                  ? '正在刷新...'
                  : countDown > 0 &&
                    Math.round(countDown / 1000) + '秒后自动刷新'}
              </span>
            </div>
            <Tooltip title="刷新">
              <Button
                disabled={!!errMsg}
                loading={loading}
                shape="circle"
                type="text"
                className="leading-none"
                icon={<RiRefreshLine size={20} />}
                onClick={refresh}
              />
            </Tooltip>
          </div>
        </div>
        <Card>
          {loading ? (
            <Skeleton active />
          ) : record ? (
            <>
              <div className="flex gap-4 py-4">
                <div className="flex-none">
                  <Avatar>
                    {(record.from_name || 'E').charAt(0).toUpperCase()}
                  </Avatar>
                </div>
                <div className="flex-auto">
                  <div className="flex justify-between items-center">
                    <div className="flex-auto">
                      <div className="font-medium flex-auto">
                        {record.from_name || '未知联系人'}
                      </div>
                    </div>
                    <div className="flex-none">
                      <span className="text-xs text-black/50">
                        {formatTimeWithTimezone(
                          record.created_at,
                          'YYYY-MM-DD HH:mm',
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-black/50 mb-2">
                    {record.from_email}
                  </div>
                </div>
              </div>
              <div className="w-full overflow-auto p-6">
                <HtmlRender dirtyHtml={record.content} />
              </div>
            </>
          ) : (
            <Empty />
          )}
        </Card>
      </div>
    </PageContainer>
  );
}
