import React, { useMemo } from 'react'
import InputNumberPlus from '@/page/ans/formmaking/components/InputNumberPlus.jsx';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'

const NumberDesign = ({ control, formConfig }) => {
  const { options } = control

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <InputNumberPlus value={options.defaultValue}/>
    </Container>

  </div>
}

export default NumberDesign
