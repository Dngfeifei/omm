import React, {useMemo, useState} from 'react'
import styled from '@emotion/styled'
import {Input} from "antd";
const { Search } = Input;
import ProjitemModal from './ProjitemModal.jsx';
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

const ProjitemRender = ({ control, formConfig }) => {
  const { options } = control
  const [visible, setVisible] = useState(false)

  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth
    }
    return formConfig.labelWidth
  }, [options, formConfig])

  const inputProps = {
    disabled: options.disabled,
    value: options.value,
    style: { width: options.width },
    placeholder: options.placeholder,
  };

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
        <Search {...inputProps} onSearch={_ => setVisible(true)} enterButton />
      </InputBox>
    </Container>
     <ProjitemModal prop_visible={visible} setValue={_ = _}  />
  </div>
}

export default ProjitemRender
