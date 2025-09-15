'use client';
import { getDomainList } from '@/api/domain';
import PageContainer from '@/app/components/page-container';
import { AntdLink } from '@/components/antd';
import { useAntdTable } from 'ahooks';
import { Alert, Table } from 'antd';
import dayjs from 'dayjs';

export default function Page() {
  const { tableProps } = useAntdTable(async ({ current, pageSize }, params) => {
    return await getDomainList({
      current,
      pageSize,
      ...params,
    }).then((res) => ({
      list: res.data.items,
      total: res.data.total,
    }));
  });

  return (
    <PageContainer title="域名" size="medium">
      <div className="mb-4">
        <Alert
          className="border-0"
          type="info"
          showIcon
          message={
            <>
              以下域名为您的私有邮箱域名，如需更多域名，请{' '}
              <AntdLink
                target="_blank"
                href={process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM}
              >
                联系我们
              </AntdLink>{' '}
              。
            </>
          }
        />
      </div>
      <div className="border border-gray-100 p-4 md:p-5 lg:p-6 rounded-2xl">
        <Table
          rowKey="id"
          columns={[
            {
              title: '域名',
              dataIndex: 'domain',
            },
            {
              title: '创建时间',
              dataIndex: 'created_at',
              render: (value) => {
                return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
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
  );
}
