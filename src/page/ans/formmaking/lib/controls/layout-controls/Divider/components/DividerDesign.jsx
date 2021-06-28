import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import styled from "@emotion/styled";

const BlankWrapper = styled.div`
  flex: 1;
  height: 40px;
  background-color: #eeeeee;
`

const DividerDesign = ({ control, formConfig }) => {
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
      <BlankWrapper>
        {options.defaultValue}
      </BlankWrapper>
    </Container>
  </div>
}

export default DividerDesign
