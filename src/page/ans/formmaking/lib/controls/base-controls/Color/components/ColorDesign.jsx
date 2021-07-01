import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker'

const ColorDesign = ({ control, formConfig }) => {
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
      <ColorPicker style={{width: 32,height: 32}}
                   color={options.defaultValue} enableAlpha={options.showAlpha} />
    </Container>
  </div>
}

export default ColorDesign
