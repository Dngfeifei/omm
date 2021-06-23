import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import { Input } from 'antd'
const { Search } = Input;
import styled from "@emotion/styled";

const Wrapper = styled.div`
  flex: 1;
`

const ProjitemDesign = ({ control, formConfig }) => {
  const { options } = control

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
      <Wrapper>
        <Search {...inputProps} onSearch={value => console.log(value)} enterButton />
      </Wrapper>
    </Container>
  </div>
}

export default ProjitemDesign
