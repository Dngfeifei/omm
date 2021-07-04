import React, { useMemo } from 'react'
import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker'

import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import { color2rgba, rgba2color } from '@/page/ans/formmaking/lib/controls/base-controls/Color/utils';

const ColorRender = ({ control, formConfig, inTable=false, onChange }) => {
  const { options } = control

  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)
  const handleChange = baseProps.onChange
  const props = {
    ...baseProps,
    onChange: color => handleChange(options.showAlpha ? color2rgba(color): color.color)
  }

  const color = useMemo(() => {
    const value = options.value || options.defaultValue
    if (options.showAlpha) {
      return rgba2color(value)
    } else {
      return {
        color: value,
        alpha: 100,
      }
    }
  }, [options.showAlpha, options.value, options.defaultValue])

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />
      <ColorPicker
        {...props}
        style={{ width: 32, height: 32 }}
        color={color.color}
        alpha={color.alpha}
        enableAlpha={options.showAlpha} />
    </Container>
  </div>
}

export default ColorRender
