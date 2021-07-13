import React, { useMemo } from 'react'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import FileUpload from '@/page/ans/formmaking/components/FileUpload';
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const FileUploadRender = ({ control, formConfig, inTable = false, onChange, isDesign = false}) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />

          <FileUpload control={control} formConfig={formConfig} onChange={baseProps.onChange} />
        </Container>

      </div>
    </ControlAdapter>
  )
}

export default FileUploadRender
