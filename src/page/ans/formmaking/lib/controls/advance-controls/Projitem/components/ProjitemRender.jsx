import React, {useMemo, useState} from 'react'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import ProjitemSelectModal from "@/page/ans/formmaking/components/projitemSelectModal";
import useFieldBaseProps from "@/page/ans/formmaking/hooks/useFieldBaseProps";

const ProjitemRender = ({ control, formConfig, inTable = false, onChange, isDesign = false}) => {

  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  const handleOk = (e) => {
    baseProps.onChange(e.projectNumber)
    //done
  }

return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />
          <ProjitemSelectModal options={options} baseProps={baseProps}
                         onOk={handleOk} />
        </Container>
      </div>
    </ControlAdapter>  )
}

export default ProjitemRender
