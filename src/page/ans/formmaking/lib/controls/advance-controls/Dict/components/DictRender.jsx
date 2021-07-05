import React, { useMemo } from 'react'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import useDictMap from "@/page/ans/formmaking/hooks/useDictMap";
import {TreeSelect} from "antd";

const DictRender = ({ control, formConfig, inTable=false, onChange }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)
  const dictMap = useDictMap()
  const treeData = dictMap[options.dictType] || []

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <TreeSelect
        {...baseProps}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        treeData={treeData}
        placeholder={options.placeholder||"请选择"}
        treeDefaultExpandAll
      />
    </Container>

  </div>
}

export default DictRender
