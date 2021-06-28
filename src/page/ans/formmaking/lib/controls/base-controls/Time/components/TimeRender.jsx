import React, { useMemo, useContext} from 'react'
import { TimePicker } from 'antd';
import styled from '@emotion/styled'
import TimeRangePicker from "@/page/ans/formmaking/lib/controls/components/TimeRangePicker";
import moment from 'moment'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';

const InputBox = styled.div`
  flex: 1;
`

const TimeRender = ({ control, formConfig }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true)
  const { updateValue } = useContext(formRenderContext);

  const onRangeChange = (v) => { updateValue(control.model, v) }
  const onChange =  (_, v) => { updateValue(control.model, v) }

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

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
              onChange={onRangeChange}
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
              onChange={onChange}
            />)
        }

      </InputBox>
    </Container>

  </div>
}

export default TimeRender
