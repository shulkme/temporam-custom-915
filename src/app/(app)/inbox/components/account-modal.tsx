import { addAccount } from '@/api/account';
import { useInbox } from '@/app/(app)/inbox/contexts';
import { AntdForm, AntdFormItem, AntdTextArea } from '@/components/antd';
import { useRequest } from 'ahooks';
import { App, FormProps, Input, Modal } from 'antd';
import React, { useEffect } from 'react';

const AccountModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const [form] = AntdForm.useForm();
  const { message } = App.useApp();

  const { currentEmail } = useInbox();

  const { loading, run } = useRequest(addAccount, {
    manual: true,
    onSuccess: () => {
      message.success('保存成功');
      setOpen(false);
      form.resetFields();
    },
    onError: (e) => {
      message.error(e.message || '保存失败');
    },
  });

  const onFinish: FormProps['onFinish'] = (values) => {
    run(values);
  };

  useEffect(() => {
    if (currentEmail?.full_address && open) {
      form.setFieldValue('email', currentEmail.full_address);
    }
  }, [currentEmail?.full_address, form, open]);

  return (
    <Modal
      title="保存账号"
      classNames={{
        content: 'w-full rounded-3xl [&>.ant-modal-close]:rounded-full',
      }}
      open={open}
      onCancel={() => setOpen(false)}
      onOk={form.submit}
      okButtonProps={{
        loading,
      }}
      cancelButtonProps={{
        disabled: loading,
      }}
    >
      <AntdForm
        disabled={loading}
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <AntdFormItem name="email" label="邮箱地址">
          <Input readOnly />
        </AntdFormItem>
        <AntdFormItem name="remark" label="邮箱地址">
          <AntdTextArea placeholder="备注" />
        </AntdFormItem>
      </AntdForm>
    </Modal>
  );
};

export default AccountModal;
