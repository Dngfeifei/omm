import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import { Input } from 'antd'
const { Search } = Input;

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
      <Search 
    
        placeholder={options.placeholder}
        defaultValue={options.defaultValue}
        style={{ width: options.width }}
       />
     
    </Container>
  </div>
}

export default UserDesign
