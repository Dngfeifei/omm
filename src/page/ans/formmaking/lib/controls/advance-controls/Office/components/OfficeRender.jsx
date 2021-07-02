import React, { useMemo } from 'react'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import OfficeSelectTree from '@/page/ans/formmaking/components/OfficeSelectTree';

const OfficeRender = ({ control, formConfig }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true)

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <OfficeSelectTree control={control} formConfig={formConfig} />
    </Container>

  </div>
}

export default OfficeRender
