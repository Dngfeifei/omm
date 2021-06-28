import React, { useMemo } from 'react'
import { Select } from 'antd'
import useDictTypeItemList from '@/page/ans/formmaking/hooks/useDictTypeItemList'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'

const SelectDesign = ({ control, formConfig }) => {
  const { options } = control
  const optionList = useDictTypeItemList(options)

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <Select defaultValue={control.defaultValue} style={{width: options.width }}>
        {optionList.map((option, index) => {
          return (<Select.Option value={option.value} key={index}>{option.label}</Select.Option>)
        })}
      </Select>
    </Container>
  </div>
}

export default SelectDesign
