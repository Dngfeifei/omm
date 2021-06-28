import React, { useMemo } from 'react'
import { Checkbox } from 'antd'
import useDictTypeItemList from '@/page/ans/formmaking/hooks/useDictTypeItemList'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'

const CheckboxRender = ({ control, formConfig }) => {
  const { options } = control

  const optionList = useDictTypeItemList(options)
  const baseProps = useFieldBaseProps(control, formConfig, true)

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <Checkbox.Group
        {...baseProps}
        value={options.value}
        defaultValue={[options.defaultValue]}
      >
        <Space control={control}>
          {optionList.map((option, index) => {
            return (<Checkbox value={option.value} key={index}>{option.label}</Checkbox>)
          })}
        </Space>
      </Checkbox.Group>
    </Container>
  </div>
}

export default CheckboxRender
