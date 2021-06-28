import React, { useMemo } from 'react'
import { Input } from 'antd';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'


const TextareaDesign = ({ control, formConfig }) => {
  const { options } = control


  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />
      <Input.TextArea
        disabled={options.disabled}
        defaultValue={options.defaultValue}
        style={{ width: options.width }}
        placeholder={options.placeholder}
      />

    </Container>
  </div>
}

export default TextareaDesign
