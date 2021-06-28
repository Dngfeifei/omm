import React, { useMemo } from 'react'
import { TimePicker } from 'antd';
import styled from '@emotion/styled'
import TimeRangePicker from "@/page/ans/formmaking/lib/controls/components/TimeRangePicker";
import moment from 'moment'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'

const InputBox = styled.div`
  flex: 1;
`

const TimeDesign = ({ control, formConfig }) => {
  const { options } = control

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <InputBox>
        {
          options.isRange ?
            (<TimeRangePicker
              allowClear={options.clearable}
              format={options.format}
              defaultValue={options.defaultValue}
              style={{ width: options.width }}
              options={options}
            />)
          :
            (<TimePicker
              disabled={options.disabled}
              allowClear={options.clearable}
              defaultValue={options.defaultValue ? moment(options.defaultValue): null}
              format={options.format}
              style={{ width: options.width }}
              placeholder={options.placeholder}
            />)
        }

      </InputBox>
    </Container>

  </div>
}

export default TimeDesign
