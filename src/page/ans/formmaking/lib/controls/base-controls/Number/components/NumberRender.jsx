import React, { useMemo } from 'react'
import InputNumberPlus from '@/page/ans/formmaking/components/InputNumberPlus.jsx';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const NumberRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />

          <InputNumberPlus
            {...baseProps}
            value={options.value}
            step={options.step}
            min={options.min}
            max={options.max}
          />
        </Container>
      </div>
    </ControlAdapter>
  )
}

export default NumberRender
