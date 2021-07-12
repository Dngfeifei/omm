import React, { useMemo } from 'react'
import { Checkbox } from 'antd'
import useDictTypeItemList from '@/page/ans/formmaking/hooks/useDictTypeItemList'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const CheckboxRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control

  const optionList = useDictTypeItemList(options)
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable}  />

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
    </ControlAdapter>
  )
}

export default CheckboxRender
