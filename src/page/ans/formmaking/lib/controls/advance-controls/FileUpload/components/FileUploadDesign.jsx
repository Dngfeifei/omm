import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import FileUpload from '@/page/ans/formmaking/components/FileUpload.jsx';

const FileUploadDesign = ({ control, formConfig }) => {
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
      <FileUpload />
    </Container>
  </div>
}

export default FileUploadDesign
