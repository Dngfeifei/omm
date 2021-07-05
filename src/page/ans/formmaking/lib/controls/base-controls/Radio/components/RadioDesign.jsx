import React, { useMemo } from 'react'
import { Radio } from 'antd'
import useDictTypeItemList from '@/page/ans/formmaking/hooks/useDictTypeItemList'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'

const RadioDesign = ({ control, formConfig, inTable=false, onChange }) => {
  const { options } = control

  const optionList = useDictTypeItemList(options)

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>

      <Label control={control} formConfig={formConfig} />

      <Radio.Group value={options.defaultValue}>
        <Space control={control}>
          {optionList.map((option, index) => {
            return (<Radio value={option.value} key={index}>{option.label}</Radio>)
          })}
        </Space>
      </Radio.Group>

    </Container>
  </div>
}

export default RadioDesign
