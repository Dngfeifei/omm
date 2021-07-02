import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import { Upload, Button } from 'antd'
import styled from "@emotion/styled";

const Wrapper = styled.div`
  flex: 1;
`

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
      <Wrapper>
        <Upload>
          <Button>点击上传</Button>
        </Upload>
      </Wrapper>
    </Container>
  </div>
}

export default FileUploadDesign
