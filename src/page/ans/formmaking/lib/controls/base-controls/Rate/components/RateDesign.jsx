import React, { useMemo } from 'react'
import StarRate from '@/page/ans/formmaking/lib/controls/components/StarRate'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'

const RateDesign = ({ control, formConfig }) => {
  const { options } = control

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <StarRate max={options.max} value={options.defaultValue || 0} />
      {options.showScore && <div>{options.defaultValue}</div>}
    </Container>
  </div>
}

export default RateDesign
