import React, { useMemo } from 'react'
import { Select } from 'antd'
import useDictTypeItemList from '@/page/ans/formmaking/hooks/useDictTypeItemList'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'

const SelectRender = ({ control, formConfig, inTable=false, onChange }) => {
  const { options } = control
  const optionList = useDictTypeItemList(options)
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <Select
        {...baseProps}
        value={options.value}
        style={{ width: options.width }}
      >
        {optionList.map((option, index) => {
          return (<Select.Option value={option.value} key={index}>{option.label}</Select.Option>)
        })}
      </Select>
    </Container>
  </div>
}

export default SelectRender
