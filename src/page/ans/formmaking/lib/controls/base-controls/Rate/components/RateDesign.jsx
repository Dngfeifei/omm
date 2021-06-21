import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import StarRate from '../../../components/StarRate'

const RateDesign = ({ control, formConfig }) => {
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
      <StarRate max={options.max} value={options.defaultValue || 0} />
      {options.showScore && <div>{options.defaultValue}</div>}
    </Container>
  </div>
}

export default RateDesign
