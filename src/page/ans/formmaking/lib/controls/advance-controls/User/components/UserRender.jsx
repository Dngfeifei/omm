import React, { useState,useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import { Select, Modal } from 'antd'
import {SearchOutlined} from '@ant-design/icons';

const UserRender = ({ control, formConfig, inTable=false, onChange }) => {
  const { options } = control

 const [visible, setVisible] = useState(false)

  const handleOk = () => {

    setVisible(false)
}
const handleCancel = () => {
    setVisible(false)
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
      <Select
       showSearch
       placeholder={options.placeholder}
       defaultValue={options.defaultValue}
       style={{ width: options.width }}
       suffixIcon={
            <SearchOutlined onClick={()=> setVisible(true) } />
       }
       />
      <Modal title="用户选择"
         visible={visible}
         onOk={handleOk}
         onCancel={handleCancel}>
            用户选择弹窗
        </Modal>
    </Container>
  </div>
}

export default UserRender
