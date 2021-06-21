import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import { Checkbox } from 'antd'

const CheckboxDesign = ({ control, formConfig }) => {
  const { options } = control

  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth
    }
    return formConfig.labelWidth
  }, [options, formConfig])
  const checkboxOptions = options.options.map(t => ({...t, label: t.value}))

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
      <Checkbox.Group
          options={checkboxOptions}
      />
    </Container>
  </div>
}

export default CheckboxDesign
