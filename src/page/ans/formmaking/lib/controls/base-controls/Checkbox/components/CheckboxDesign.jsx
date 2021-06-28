import React, { useMemo } from 'react'
import { Checkbox } from 'antd'
import useDictTypeItemList from '@/page/ans/formmaking/hooks/useDictTypeItemList'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'

const CheckboxDesign = ({ control, formConfig }) => {
  const { options } = control

  const optionList = useDictTypeItemList(options)

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <Checkbox.Group defaultValue={[control.defaultValue]}>
        <Space control={control}>
          {optionList.map((option, index) => {
            return (<Checkbox value={option.value} key={index}>{option.label}</Checkbox>)
          })}
        </Space>
      </Checkbox.Group>
    </Container>
  </div>
}

export default CheckboxDesign
