import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import {Select} from "antd";

const AreaDesign = ({ control, formConfig }) => {
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
      <Select style={{width: '100%'}} />
    </Container>
  </div>
}

export default AreaDesign
