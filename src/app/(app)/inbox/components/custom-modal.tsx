import { useInbox } from '@/app/(app)/inbox/contexts';
import { AntdForm, AntdFormItem } from '@/components/antd';
import { RiDice3Line } from '@remixicon/react';
import {
  Button,
  ConfigProvider,
  FormProps,
  Input,
  Modal,
  Select,
  Tooltip,
} from 'antd';
import { debounce } from 'radash';
import React from 'react';

const CustomModal: React.FC<{
  open: boolean;
  setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => {
  const { domains, setCurrentEmail, currentEmail, randomEmail } = useInbox();
  const [form] = AntdForm.useForm();
  const onRandom = debounce(
    {
      delay: 300,
    },
    () => {
      const email = randomEmail(domains, currentEmail?.domain.domain);
      if (email) {
        form.setFieldsValue({
          name: email.name,
          domain: email.domain.id,
        });
      }
    },
  );

  const onFinish: FormProps['onFinish'] = (values) => {
    const { domain: id, name } = values;
    const domain = domains.find((f) => f.id.toString() === id);
    if (domain) {
      const full_address = [name, domain.domain].join('@');
      setCurrentEmail({
        name,
        full_address,
        domain,
      });
      setOpen(false);
    }
  };

  return (
    <Modal
      title="自定义邮箱"
      classNames={{
        content: 'w-full rounded-3xl [&>.ant-modal-close]:rounded-full',
      }}
      open={open}
      onCancel={() => setOpen(false)}
      onOk={form.submit}
    >
      <ConfigProvider
        theme={{
          components: {
            Input: {
              fontSize: 18,
              paddingInline: 0,
            },
            Select: {
              fontSize: 18,
            },
          },
        }}
      >
        <div className="py-4">
          <AntdForm
            form={form}
            initialValues={{
              name: currentEmail?.name,
              domain: currentEmail?.domain?.id,
            }}
            layout="vertical"
            variant="borderless"
            onFinish={onFinish}
          >
            <div className="flex items-center bg-gray-50 p-4 rounded-lg">
              <div className="flex-auto">
                <AntdFormItem name="name" noStyle>
                  <Input placeholder="请输入用户名" autoFocus />
                </AntdFormItem>
              </div>
              <div className="flex-none">
                <AntdFormItem name="domain" noStyle>
                  <Select
                    fieldNames={{
                      label: 'domain',
                      value: 'id',
                    }}
                    style={{ minWidth: 120 }}
                    prefix={'@'}
                    options={domains}
                    placeholder="域名"
                    popupMatchSelectWidth={200}
                  />
                </AntdFormItem>
              </div>
              <div className="flex-none">
                <Tooltip title="随机邮箱">
                  <Button
                    shape="circle"
                    type="text"
                    className="leading-none"
                    icon={<RiDice3Line size={20} />}
                    onClick={onRandom}
                  />
                </Tooltip>
              </div>
            </div>
          </AntdForm>
        </div>
      </ConfigProvider>
    </Modal>
  );
};

export default CustomModal;
