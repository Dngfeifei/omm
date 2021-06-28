import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import {Switch} from 'antd'

const SwitchDesign = ({ control, formConfig }) => {
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
      <Switch checked={Boolean(options.defaultValue)} />
    </Container>
  </div>
}

export default SwitchDesign
