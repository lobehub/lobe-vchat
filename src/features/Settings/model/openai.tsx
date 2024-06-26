import { Form, FormGroup, FormItem } from '@lobehub/ui';
import { useRequest } from 'ahooks';
import { Form as AForm, Button, Input, message } from 'antd';
import { createStyles } from 'antd-style';
import classNames from 'classnames';
import { debounce, isEqual } from 'lodash-es';
import { BotIcon } from 'lucide-react';
import React, { useEffect } from 'react';

import { chatCompletion } from '@/services/chat';
import { configSelectors, useSettingStore } from '@/store/setting';
import { ChatMessage } from '@/types/chat';

interface ConfigProps {
  className?: string;
  style?: React.CSSProperties;
}

const useStyles = createStyles(({ css }) => ({
  config: css`
    display: flex;
    flex-grow: 1;
    justify-content: center;
  `,
}));

const Config = (props: ConfigProps) => {
  const { style, className } = props;
  const { styles } = useStyles();
  const [form] = AForm.useForm();
  const openAIConfig = useSettingStore((s) => configSelectors.currentOpenAIConfig(s), isEqual);
  const setOpenAIConfig = useSettingStore((s) => s.setOpenAIConfig);

  useEffect(() => {
    form.setFieldsValue(openAIConfig);
  }, [openAIConfig, form]);

  const { loading, run: checkConnect } = useRequest(chatCompletion, {
    manual: true,
    onSuccess: (res) => {
      if (!res.ok) {
        message.error('调用接口失败，请检查 APIKey 和接口代理地址是否设置正确');
        return;
      }
      message.success('检查通过');
    },
  });

  return (
    <div className={classNames(styles.config, className)} style={style}>
      <Form
        form={form}
        onValuesChange={debounce(setOpenAIConfig, 100)}
        style={{ display: 'flex', flexGrow: 1 }}
      >
        <FormGroup icon={BotIcon} title={'OpenAI 语言模型'}>
          <FormItem desc={'请使用自己的 OpenAI Key'} divider label={'API Key'} name="apikey">
            <Input.Password placeholder="sk-" style={{ width: 480 }} />
          </FormItem>
          <FormItem desc={'http(s)://'} divider label={'接口代理地址'} name="endpoint">
            <Input placeholder="" style={{ width: 360 }} />
          </FormItem>
          <FormItem desc={'检查 APIKey 和接口代理地址是否设置正确'} divider label={'连通性检查'}>
            <Button
              loading={loading}
              onClick={() =>
                checkConnect({
                  messages: [
                    {
                      content: 'Hi',
                      role: 'user',
                    } as ChatMessage,
                  ],
                  model: 'gpt-3.5-turbo',
                })
              }
            >
              检查
            </Button>
          </FormItem>
        </FormGroup>
      </Form>
    </div>
  );
};

export default Config;
