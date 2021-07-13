import React, { useMemo } from 'react'
import { Radio } from 'antd'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import useDictTypeItemList from '@/page/ans/formmaking/hooks/useDictTypeItemList'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const RadioRender = ({ control, formConfig, inTable = false, onChange, isDesign = false}) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, false, inTable, onChange)
  const optionList = useDictTypeItemList(options)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />

          <Radio.Group
            {...baseProps}
            value={options.value}
          >
            <Space control={control}>
              {optionList.map((option, index) => {
                return (<Radio value={option.value} key={index}>{option.label}</Radio>)
              })}
            </Space>
          </Radio.Group>

        </Container>
      </div>
    </ControlAdapter>
  )
}

export default RadioRender
