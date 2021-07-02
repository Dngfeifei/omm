import React, { useMemo, useContext } from 'react'
import { DatePicker } from 'antd';
import styled from '@emotion/styled'
import moment from 'moment'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';

const InputBox = styled.div`
  flex: 1;
`

const DateRender = ({ control, formConfig }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true)

  const { updateValue } = useContext(formRenderContext)
  const onChange = (_, v) => { updateValue(control.model, options.timestamp ? _.valueOf() : v) }

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />

      <InputBox>
        <DatePicker
          {...baseProps}
          allowClear={options.clearable}
          defaultValue={options.defaultValue ? moment(options.defaultValue) : null}
          defaultValue={options.value ? moment(options.value) : null}
          format={options.format}
          onChange={onChange}
        />
      </InputBox>
    </Container>

  </div>
}

export default DateRender
