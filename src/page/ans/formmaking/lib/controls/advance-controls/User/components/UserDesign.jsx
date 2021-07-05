import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import { Select } from 'antd'
import {SearchOutlined} from '@ant-design/icons';
const UserDesign = ({ control, formConfig, inTable=false, onChange }) => {
  const { options } = control

  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth
    }
    return formConfig.labelWidth
  }, [options, formConfig])

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      {!options.hideLabel && <Label
        labelPosition={formConfig.labelPosition}
        labelWidth={labelWidth}
      >
        {options.required && <span>*</span>}
        {control.name}
      </Label>
      }
      <Select
       showSearch
       placeholder={options.placeholder}
       defaultValue={options.defaultValue}
       style={{ width: options.width }}
       suffixIcon={
            <SearchOutlined />
       }
       />
    </Container>
  </div>
}

export default UserDesign
