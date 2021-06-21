import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import { TreeSelect } from 'antd'
import styled from "@emotion/styled";

const Wrapper = styled.div`
  flex: 1;
`

const SelectTreeDesign = ({ control, formConfig }) => {
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
      <Wrapper>
        <TreeSelect value={options.defaultValue} treeData={options.options} placeholder={options.placeholder} />
      </Wrapper>
    </Container>
  </div>
}

export default SelectTreeDesign
