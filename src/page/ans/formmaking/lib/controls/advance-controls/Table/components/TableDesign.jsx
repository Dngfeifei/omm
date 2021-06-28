import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import { Slider } from 'antd'
import styled from "@emotion/styled";

const SliderWrapper = styled.div`
  flex: 1;
`

const TableDesign = ({ control, formConfig }) => {
  const { options } = control

  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth
    }
    return formConfig.labelWidth
  }, [options, formConfig])

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      {!options.hideLabel && <Label
        labelPosition={formConfig.labelPosition}
        labelWidth={labelWidth}
      >
        {options.required && <span>*</span>}
        {control.name}
      </Label>
      }
      <SliderWrapper>
        <Slider min={options.min}
                defaultValue={options.defaultValue}
                range={options.range}
                max={options.max}
                step={options.step} />
      </SliderWrapper>
    </Container>
  </div>
}

export default TableDesign
