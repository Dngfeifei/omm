import React, { useMemo } from 'react'
import InputNumberPlus from '@/page/ans/formmaking/components/InputNumberPlus.jsx';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'

const NumberDesign = ({ control, formConfig }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true)

  console.log('number render value', options.value);
  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <InputNumberPlus
        {...baseProps}
        value={options.value}
        step={options.step}
        min={options.min}
        max={options.max}
      />
    </Container>

  </div>
}

export default NumberDesign
