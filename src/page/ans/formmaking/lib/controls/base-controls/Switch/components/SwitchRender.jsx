import React, { useMemo } from 'react'
import { Switch } from 'antd';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const SwitchRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable}/>
          <Switch
            {...baseProps}
            checked={options.value || options.defaultValue}
          />
        </Container>
      </div>
    </ControlAdapter>
  )
}

export default SwitchRender
