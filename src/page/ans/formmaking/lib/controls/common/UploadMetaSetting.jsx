import React from 'react'
import styled from '@emotion/styled'
import { css } from '@emotion/css';
import { Checkbox, Select, Input, Switch, Button } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons';
import FormAttrItem from '@/page/ans/formmaking/components/FormAttrItem.jsx';

const HeaderWrap = styled.div`
  display: flex;
  flex-flow: no-wrap;
  margin-bottom: 5px;
  padding-right: 10px;
`
const removeIcon = css`
  font-size: 20px;
  margin-top: 5px;
  color: #F56C6C;
`

const UploadMetaSetting = ({ options, updateOptions }) => {
  return (<div>
    <FormAttrItem label="使用七牛上传">
      <Switch
        checked={options.isQiniu}
        onChange={(checked) => updateOptions({ isQiniu: checked })}
      />
    </FormAttrItem>

    {options.isQiniu ? (
      <div>
        <FormAttrItem label="Domain" required>
          <Input
            value={options.domain}
            onChange={(e) => {
              updateOptions({ domain: e.target.value });
            }}
          />
        </FormAttrItem>
        <FormAttrItem label="获取七牛Token方法" required>
          <Input
            value={options.tokenFunc}
            onChange={(e) => {
              updateOptions({ tokenFunc: e.target.value });
            }}
          />
        </FormAttrItem>

      </div>
    ) : (
      <div>
        <FormAttrItem label="上传地址" required>
          <Input
            value={options.action}
            onChange={(e) => {
              updateOptions({ action: e.target.value });
            }}
          />
        </FormAttrItem>

        <FormAttrItem label="设置上传的请求头">
          {options.headers.map((header, index) => {
            return (
              <HeaderWrap key={index}>
                <Input placeholder="KEY" value={options.headers[index].key} onChange={e => {
                  updateOptions({
                    headers: options.headers.map((item, itemIndex) => {
                      return itemIndex === index ? {
                        ...item,
                        key: e.target.value
                      } : item
                    })
                  })
                }} />
                <Input placeholder="VALUE" value={options.headers[index].value} onChange={e => {
                  updateOptions({
                    headers: options.headers.map((item, itemIndex) => {
                      return itemIndex === index ? {
                        ...item,
                        value: e.target.value
                      } : item
                    })
                  })
                }} />
                <MinusCircleOutlined className={removeIcon} onClick={() => {
                  updateOptions({
                    headers: options.headers.filter((item, itemIndex) => {
                      return itemIndex !== index
                    })
                  })
                }} />
              </HeaderWrap>
            )
          })}
          <Button type="link" onClick={() => {
            updateOptions({
              headers: [...options.headers, {
                key: '',
                value: ''
              }]
            });
          }}>添加</Button>
        </FormAttrItem>
      </div>
    )}

  </div>)
}

export default UploadMetaSetting
