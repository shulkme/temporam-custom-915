'use client';
import { register } from '@/api/auth';
import {
  AntdForm,
  AntdFormItem,
  AntdInputPassword,
  AntdParagraph,
} from '@/components/antd';
import { useRequest } from 'ahooks';
import { App, Button, Divider, FormProps, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  // const { setUser } = useAuthorized();
  const [form] = AntdForm.useForm();
  const [errMsg, setErrMsg] = useState<string>();
  const router = useRouter();
  const { message } = App.useApp();
  const { run: doSubmit, loading: submitting } = useRequest(register, {
    manual: true,
    onSuccess: () => {
      // const { token, user } = res.data;
      // setUser(user);
      // setToken(token);
      setErrMsg(undefined);
      form.resetFields();
      message.success('注册成功');
      router.replace('/login');
    },
    onError: (e) => {
      setErrMsg(e.message);
    },
  });

  const onFinish: FormProps['onFinish'] = (values) => {
    doSubmit(values);
  };
  return (
    <>
      <div className="text-3xl font-bold mb-6 text-center">注册</div>
      <AntdForm
        size="large"
        variant="filled"
        form={form}
        disabled={submitting}
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
          label={<span className="font-bold">密码</span>}
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
            注册
          </Button>
        </AntdFormItem>
        <AntdFormItem noStyle>
          <div className="text-center text-xs">
            注册即表示您同意我们的<a href="#">用户协议</a>及
            <a href="#">隐私政策</a>。
          </div>
        </AntdFormItem>
        <AntdFormItem>
          <Divider plain>
            <span className="text-black/50">已有账户？</span>
          </Divider>
        </AntdFormItem>
        <AntdFormItem>
          <Link href="/login">
            <Button block>立即登录</Button>
          </Link>
        </AntdFormItem>
      </AntdForm>
    </>
  );
}
