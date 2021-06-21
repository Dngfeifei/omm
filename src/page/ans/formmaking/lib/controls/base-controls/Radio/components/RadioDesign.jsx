import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import { Radio } from 'antd'
import styled from "@emotion/styled";

const Space = styled.div`
  display: flex;
  flex-direction: ${props => props.direction};
`

const RadioDesign = ({ control, formConfig }) => {
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

      <Radio.Group value={options.defaultValue}>
        <Space direction={options.inline ? 'row' : 'column'}>
          <Radio value={1}>Option A</Radio>
          <Radio value={2}>Option B</Radio>
          <Radio value={3}>Option C</Radio>
        </Space>
      </Radio.Group>

    </Container>
  </div>
}

export default RadioDesign
