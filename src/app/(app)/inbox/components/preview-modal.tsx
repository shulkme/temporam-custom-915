'use client';
import { getEmailDetail } from '@/api/email';
import { EmailRecord } from '@/api/email/types';
import HtmlRender from '@/components/html-render';
import { formatTimeWithTimezone } from '@/utils/time';
import { useRequest } from 'ahooks';
import { Avatar, Empty, Modal, Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';

const PreviewModal: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState<EmailRecord>();

  const afterClose = () => {
    setRecord(undefined);
  };

  const { run, loading } = useRequest(getEmailDetail, {
    manual: true,
    onSuccess: (res) => {
      setRecord(res.data);
    },
  });

  useEffect(() => {
    const handler = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      setOpen(true);
      run(id);
    };
    window.addEventListener('mail:preview', handler);

    return () => {
      window.removeEventListener('mail:preview', handler);
      setRecord(undefined);
    };
  }, []);

  return (
    <Modal
      footer={false}
      afterClose={afterClose}
      title="详情"
      open={open}
      onCancel={() => setOpen(false)}
      classNames={{
        content: 'w-full rounded-3xl [&>.ant-modal-close]:rounded-full',
      }}
      width="100%"
      className="max-w-4xl"
    >
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
    </Modal>
  );
};

export default PreviewModal;
