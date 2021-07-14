import React from 'react'
import { TimePicker } from 'antd';
import styled from '@emotion/styled'
import TimeRangePicker from "@/page/ans/formmaking/lib/controls/components/TimeRangePicker";
import moment from 'moment'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const InputBox = styled.div`
  flex: 1;
`

const TimeRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable}  />

          <InputBox>
            {
              options.isRange ?
                (<TimeRangePicker
                  {...baseProps}
                  allowClear={options.clearable}
                  format={options.format}
                  defaultValue={options.defaultValue}
                  value={options.value}
                  options={options}
                />)
                :
                (<TimePicker
                  {...baseProps}
                  disabled={options.disabled}
                  allowClear={options.clearable}
                  defaultValue={options.defaultValue ? moment(options.defaultValue, options.format) : null}
                  format={options.format}
                  value={options.value ? moment(options.value, options.format) : null}
                  placeholder={options.placeholder}
                />)
            }

          </InputBox>
        </Container>

      </div>
    </ControlAdapter>
  )
}

export default TimeRender
