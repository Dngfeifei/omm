import React, { useMemo } from 'react'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import UserSelectModal from '@/page/ans/formmaking/components/UserSelectModal.jsx';
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'

const UserRender = ({ control, formConfig, inTable = false, onChange, isDesign = false}) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  const handleOk = (e) => {
    baseProps.onChange(e.map(d => d.id).join(','))
      //done
      console.log(e);
  }

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />

          <UserSelectModal
            options={options}
            onOk={handleOk}
          >
          </UserSelectModal>
        </Container>
      </div>
    </ControlAdapter>
  )
}

export default UserRender
