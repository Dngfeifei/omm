import React from 'react'
import styled from '@emotion/styled'
import { Checkbox, Select, Input } from 'antd'

const FlexBox = styled.div`
  display: flex;
  margin-top: 10px;
`

const opts = [
  { type: 'string', text: '字符串' },
  { type: 'number', text: '数字' },
  { type: 'integer', text: '整数' },
  { type: 'float', text: '浮点数' },
  { type: 'url', text: 'URL地址' },
  { type: 'email', text: '邮箱地址' },
  { type: 'hex', text: '16进制' },

]

const DataTypeSetting = ({ dataType, dataTypeCheck, dataTypeMessage, updateOptions }) => {
  return <FlexBox>
    <div>
      <Checkbox style={{ lineHeight: '32px' }}
        checked={dataTypeCheck}
        onChange={e => updateOptions({ dataTypeCheck: e.target.checked })}
      />
    </div>
    <div style={{ flex: 1, paddingLeft: 8 }}>
      <div>
        <Select
          value={dataType || undefined}
          style={{ width: 200 }}
          placeholder="请选择"
          disabled={!dataTypeCheck}
          onChange={(value) => { updateOptions({ dataType: value }) }}>
          {
            opts.map(item => <Select.Option value={item.type} key={item.type}>{item.text}</Select.Option>)
          }
        </Select>
      </div>
      {
        dataType && <div style={{ marginTop: 6 }}>
          <Input
            disabled={!dataTypeCheck}
            value={dataTypeMessage}
            placeholder="自定义错误提示"
            onChange={e => { updateOptions({ dataTypeMessage: e.target.value }) }}
          />
        </div>
      }
    </div>
  </FlexBox>
}

export default DataTypeSetting
