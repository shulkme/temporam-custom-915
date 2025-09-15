import { setAccountRemark } from '@/api/account';
import { AccountRecord } from '@/api/account/types';
import { AntdForm, AntdFormItem, AntdTextArea } from '@/components/antd';
import { useRequest } from 'ahooks';
import { App, FormProps, Modal } from 'antd';
import React, { useEffect } from 'react';

const RemarkModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
  record?: AccountRecord;
  afterClose?: () => void;
  afterSubmit?: () => void;
}> = ({ open, setOpen, record, afterClose, afterSubmit }) => {
  const [form] = AntdForm.useForm();
  const { message } = App.useApp();

  const _afterClose = () => {
    form.resetFields();
    afterClose?.();
  };

  const { loading: submitting, run: doSubmit } = useRequest(setAccountRemark, {
    manual: true,
    onSuccess: () => {
      message.success('修改成功');
      setOpen(false);
      afterSubmit?.();
    },
    onError: (e) => {
      message.error(e.message || '修改失败');
    },
  });

  const onFormFinish: FormProps['onFinish'] = (values) => {
    doSubmit(record!.id, values);
  };

  useEffect(() => {
    if (open && record) {
      form.setFieldValue('remark', record.remark);
    }
  }, [form, open, record]);
  return (
    <Modal
      afterClose={_afterClose}
      title="添加备注"
      open={open}
      onCancel={() => setOpen(false)}
      okButtonProps={{
        loading: submitting,
      }}
      cancelButtonProps={{
        disabled: submitting,
      }}
      onOk={form.submit}
    >
      <AntdForm form={form} layout="vertical" onFinish={onFormFinish}>
        <AntdFormItem
          name="remark"
          messageVariables={{
            label: '备注',
          }}
        >
          <AntdTextArea rows={5} placeholder="请输入备注" />
        </AntdFormItem>
      </AntdForm>
    </Modal>
  );
};

export default RemarkModal;
