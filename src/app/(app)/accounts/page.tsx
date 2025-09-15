'use client';
import { delAccount, getAccountList } from '@/api/account';
import { AccountRecord } from '@/api/account/types';
import RemarkModal from '@/app/(app)/accounts/components/remark-modal';
import PageContainer from '@/app/components/page-container';
import { AntdLink } from '@/components/antd';
import { RiEditBoxLine } from '@remixicon/react';
import { useAntdTable } from 'ahooks';
import { Alert, App, Popconfirm, Space, Table } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';

const generateURL = (email: string, code: string) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/emails?email=${email}&code=${code}`;
};
export default function Page() {
  const { message } = App.useApp();
  const [remarkEditOpen, setRemarkEditOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<AccountRecord>();
  const { tableProps, refresh } = useAntdTable(
    async ({ current, pageSize }, params) => {
      return await getAccountList({
        current,
        pageSize,
        ...params,
      }).then((res) => ({
        list: res.data.items,
        total: res.data.total,
      }));
    },
  );

  const handleDelete = async (id: number) => {
    try {
      await delAccount(id);
      message.success('删除成功');
      refresh();
    } catch (e) {
      message.error((e as unknown as Error).message || '删除失败');
    }
  };

  const onRemarkEdit = (record: AccountRecord) => {
    setCurrentRecord(record);
    setRemarkEditOpen(true);
  };

  return (
    <>
      <PageContainer title="账号" size="medium">
        <div className="mb-4">
          <Alert
            className="border-0"
            type="info"
            showIcon
            message={
              <>
                每个账号对应的链接都可以单独接码，链接有效期为2个小时，过期请刷新页面并重新获取。
              </>
            }
          />
        </div>
        <div className="border border-gray-100 p-4 md:p-5 lg:p-6 rounded-2xl">
          <Table
            rowKey="id"
            columns={[
              {
                title: '邮箱',
                dataIndex: 'email',
              },
              {
                title: '备注',
                dataIndex: 'remark',
                render: (value, record) => {
                  return (
                    <>
                      <span className="inline">{value}</span>
                      <span
                        className="inline cursor-pointer text-black/50 hover:text-(--ant-color-primary)"
                        onClick={() => onRemarkEdit(record)}
                      >
                        <RiEditBoxLine className="inline" size={14} />
                      </span>
                    </>
                  );
                },
              },
              {
                title: '创建时间',
                dataIndex: 'created_time',
                render: (value) => {
                  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
                },
              },
              {
                title: '操作',
                width: 160,
                render: (_, record) => {
                  return (
                    <Space size="middle">
                      <AntdLink
                        copyable={{
                          text: generateURL(record.email, record.code),
                          icon: [<>复制链接</>, <>复制成功</>],
                        }}
                      />
                      <Popconfirm
                        title="删除账号"
                        description="确定要删除此账号？"
                        onConfirm={() => handleDelete(record.id)}
                      >
                        <AntdLink>删除</AntdLink>
                      </Popconfirm>
                    </Space>
                  );
                },
              },
            ]}
            scroll={{
              x: 640,
            }}
            {...tableProps}
            pagination={{
              hideOnSinglePage: true,
              size: 'small',
              ...tableProps.pagination,
            }}
          />
        </div>
      </PageContainer>
      <RemarkModal
        open={remarkEditOpen}
        setOpen={setRemarkEditOpen}
        record={currentRecord}
        afterSubmit={refresh}
        afterClose={() => setCurrentRecord(undefined)}
      />
    </>
  );
}
