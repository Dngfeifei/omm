import React, { useMemo } from 'react'
import StarRate from '@/page/ans/formmaking/lib/controls/components/StarRate'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'

const RateDesign = ({ control, formConfig }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true)

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <StarRate
        max={options.max}
        {...baseProps}
        value={options.value || options.defaultValue || 0}
      />
      {options.showScore && <div>{options.defaultValue}</div>}
    </Container>
  </div>
}

export default RateDesign
