import React, { useMemo } from 'react'
import { Input } from 'antd';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'


const TextareaRender = ({ control, formConfig, inTable=false, onChange }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, false, inTable, onChange)

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />
      <Input.TextArea
        {...baseProps}
        value={options.value}
      />
    </Container>
  </div>
}

export default TextareaRender
