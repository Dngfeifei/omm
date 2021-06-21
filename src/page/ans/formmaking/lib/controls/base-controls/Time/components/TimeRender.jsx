import React, { useMemo } from 'react'
import { Input } from 'antd';
import styled from '@emotion/styled'

const Container = styled.div`
  display: ${({ labelPosition }) => (labelPosition === 'top' ? 'block' : 'flex')};
`
const Label = styled.div`
  width: ${({ labelWidth }) => labelWidth}px;
  text-align: ${({ labelPosition }) => labelPosition};
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  > span{
    color: #f56c6c;
    margin-right: 2px;
    font-size: 14px;
  }
`
const InputBox = styled.div`
  flex: 1;
`

const TimeRender = ({ control, formConfig }) => {
  const { options } = control

  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth
    }
    return formConfig.labelWidth
  }, [options, formConfig])

  return <div className={options.customClass}>
    <Container labelPosition={formConfig.labelPosition}>
      {!options.hideLabel && <Label
        labelPosition={formConfig.labelPosition}
        labelWidth={labelWidth}
      >
        {options.required && <span>*</span>}
        {control.name}
      </Label>
      }
      <InputBox>
        {
          options.showPassword ? <Input.Password disabled={options.disabled} defaultValue={options.defaultValue} style={{ width: options.width }} placeholder={options.placeholder} />
            : <Input disabled={options.disabled} defaultValue={options.defaultValue} style={{ width: options.width }} placeholder={options.placeholder} />
        }
      </InputBox>
    </Container>

    {/* <pre>{JSON.stringify(options, null, 2)}</pre> */}
  </div>
}

export default TimeRender
