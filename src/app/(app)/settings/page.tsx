'use client';
import { changeUserPassword } from '@/api/user';
import PageContainer from '@/app/components/page-container';
import { AntdForm, AntdFormItem, AntdInputPassword } from '@/components/antd';
import { useRequest } from 'ahooks';
import { App, Button, FormProps } from 'antd';

export default function Page() {
  const [form] = AntdForm.useForm();
  const { message } = App.useApp();

  const { run: doSubmit, loading: submitting } = useRequest(
    changeUserPassword,
    {
      manual: true,
      onSuccess: () => {
        message.success('修改成功');
        form.resetFields();
      },
      onError: (e) => {
        message.error(e.message || '修改失败');
      },
    },
  );

  const handleFormFinish: FormProps['onFinish'] = (values) => {
    doSubmit(values);
  };
  return (
    <PageContainer title="设置" size="small">
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-bold mb-4">修改密码</h2>
          <div className="border border-gray-100 p-4 md:p-5 lg:p-6 rounded-2xl">
            <AntdForm
              disabled={submitting}
              layout="vertical"
              wrapperCol={{
                sm: 24,
                md: 24,
                lg: 12,
                xl: 12,
              }}
              form={form}
              onFinish={handleFormFinish}
              requiredMark={false}
              validateTrigger={['onBlur']}
            >
              <AntdFormItem
                messageVariables={{
                  label: '旧密码',
                }}
                label="旧密码"
                rules={[
                  {
                    required: true,
                  },
                  {
                    min: 6,
                  },
                  {
                    max: 16,
                  },
                ]}
                name="old_password"
              >
                <AntdInputPassword placeholder="请输入旧密码" />
              </AntdFormItem>
              <AntdFormItem
                messageVariables={{
                  label: '新密码',
                }}
                label="新密码"
                rules={[
                  {
                    required: true,
                  },
                  {
                    min: 6,
                  },
                  {
                    max: 16,
                  },
                ]}
                name="new_password"
              >
                <AntdInputPassword placeholder="请输入新密码" />
              </AntdFormItem>
              <AntdFormItem
                messageVariables={{
                  label: '确认密码',
                }}
                label="确认密码"
                rules={[
                  {
                    required: true,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('new_password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('确认密码与新密码不一致'),
                      );
                    },
                  }),
                ]}
                name="confirm_password"
              >
                <AntdInputPassword placeholder="请输入确认密码" />
              </AntdFormItem>
              <AntdFormItem noStyle>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  更新
                </Button>
              </AntdFormItem>
            </AntdForm>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
