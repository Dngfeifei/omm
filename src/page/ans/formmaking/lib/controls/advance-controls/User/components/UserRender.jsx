import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import UserSelectModal from '@/page/ans/formmaking/components/UserSelectModal.jsx';

const UserRender = ({ control, formConfig, inTable=false, onChange }) => {
  const { options } = control
  const handleOk = (e) => {
      //done
  }


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
    
      <UserSelectModal 
         options={options}
         onOk={()=>handleOk()}
         >
      </UserSelectModal>
    </Container>
  </div>
}

export default UserRender
