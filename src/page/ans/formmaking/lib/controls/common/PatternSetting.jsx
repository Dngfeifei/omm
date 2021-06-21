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

const PatternSetting = ({ pattern, patternCheck, patternMessage, updateOptions }) => {
  return <FlexBox>
    <div>
      <Checkbox style={{ lineHeight: '32px' }}
        checked={patternCheck}
        onChange={e => updateOptions({ patternCheck: e.target.checked })}
      />
    </div>
    <div style={{ flex: 1, paddingLeft: 8 }}>
      <div>
        <Input
          value={pattern}
          placeholder="填写正则表达式"
          disabled={!patternCheck}
          onChange={e => { updateOptions({ pattern: e.target.value }) }}
        />

      </div>
      {
        patternCheck && <div style={{ marginTop: 6 }}>
          <Input
            disabled={!patternCheck}
            value={patternMessage}
            placeholder="自定义错误提示"
            onChange={e => { updateOptions({ patternMessage: e.target.value }) }}
          />
        </div>
      }
    </div>
  </FlexBox>
}

export default PatternSetting
