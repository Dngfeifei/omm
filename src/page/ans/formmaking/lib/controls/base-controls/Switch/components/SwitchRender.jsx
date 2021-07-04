import React, { useMemo } from 'react'
import { Switch } from 'antd';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'

const SwitchRender = ({ control, formConfig, inTable=false, onChange }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />
      <Switch
        {...baseProps}
        checked={options.value || options.defaultValue}
      />
    </Container>
  </div>
}

export default SwitchRender
