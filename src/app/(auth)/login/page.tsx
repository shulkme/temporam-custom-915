'use client';
import { login } from '@/api/auth';
import {
  AntdForm,
  AntdFormItem,
  AntdInputPassword,
  AntdLink,
  AntdParagraph,
} from '@/components/antd';
import { useIdentity } from '@/providers/identity';
import { delToken, setToken } from '@/utils/token';
import { useRequest } from 'ahooks';
import { Button, Divider, FormProps, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page() {
  const { setUser } = useIdentity();
  const [form] = AntdForm.useForm();
  const [errMsg, setErrMsg] = useState<string>();
  const router = useRouter();

  const { run: doSubmit, loading: submitting } = useRequest(login, {
    manual: true,
    onSuccess: (res) => {
      const { token, user } = res.data;
      setUser(user);
      setToken(token);
      setErrMsg(undefined);
      form.resetFields();
      router.replace('/');
    },
    onError: (e) => {
      setErrMsg(e.message);
    },
  });

  const onFinish: FormProps['onFinish'] = (values) => {
    doSubmit(values);
  };

  useEffect(() => {
    delToken();
  }, []);

  return (
    <>
      <div className="text-3xl font-bold mb-6 text-center">登录</div>
      <AntdForm
        size="large"
        variant="filled"
        disabled={submitting}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        requiredMark={false}
        validateTrigger={['onBlur']}
      >
        {errMsg && (
          <AntdParagraph type="danger" className="text-center">
            {errMsg}
          </AntdParagraph>
        )}
        <AntdFormItem
          messageVariables={{
            label: '用户名',
          }}
          name="username"
          label={<span className="font-bold">用户名</span>}
          rules={[
            {
              required: true,
              min: 4,
              max: 16,
            },
          ]}
        >
          <Input placeholder="用户名" />
        </AntdFormItem>
        <AntdFormItem
          messageVariables={{
            label: '密码',
          }}
          className="[&>div>div>label]:flex [&>div>div>label]:after:hidden"
          name="password"
          label={
            <div className="flex flex-auto items-center justify-between">
              <span className="font-bold">密码</span>
              <AntdLink
                target="_blank"
                tabIndex={-1}
                href={process.env.NEXT_PUBLIC_SUPPORT_TELEGRAM}
              >
                忘记密码？
              </AntdLink>
            </div>
          }
          rules={[
            {
              required: true,
              min: 6,
              max: 16,
            },
          ]}
        >
          <AntdInputPassword placeholder="密码" />
        </AntdFormItem>
        <AntdFormItem>
          <Button loading={submitting} block type="primary" htmlType="submit">
            登录
          </Button>
        </AntdFormItem>
        <AntdFormItem>
          <Divider plain>
            <span className="text-black/50">没有账户？</span>
          </Divider>
        </AntdFormItem>
        <AntdFormItem>
          <Link href="/signup">
            <Button block>注册</Button>
          </Link>
        </AntdFormItem>
      </AntdForm>
    </>
  );
}
