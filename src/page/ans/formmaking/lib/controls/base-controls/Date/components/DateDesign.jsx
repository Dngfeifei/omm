import React, { useMemo } from 'react'
import { DatePicker } from 'antd';
import styled from '@emotion/styled'
import moment from 'moment'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'

const InputBox = styled.div`
  flex: 1;
`

const DateDesign = ({ control, formConfig, inTable=false, onChange }) => {
  const { options } = control

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <InputBox>
        <DatePicker
          disabled={options.disabled}
          allowClear={options.clearable}
          format={options.format}
          style={{ width: options.width }}
          placeholder={options.placeholder}
        />
      </InputBox>
    </Container>

  </div>
}

export default DateDesign
