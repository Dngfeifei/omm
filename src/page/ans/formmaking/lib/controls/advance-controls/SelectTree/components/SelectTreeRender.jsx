import React, { useMemo } from 'react'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import {TreeSelect} from "antd";
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const SelectTreeRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />

          <TreeSelect
            {...baseProps}
            value={options.value}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={options.options}
            placeholder="加载数据中..."
            treeDefaultExpandAll
          />
        </Container>

      </div>
    </ControlAdapter>
  )
}

export default SelectTreeRender
