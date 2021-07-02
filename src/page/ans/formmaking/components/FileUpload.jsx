import React, { useContext } from "react";
import { Upload, Button } from 'antd'
import styled from "@emotion/styled";
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';

const Wrapper = styled.div`
  flex: 1;
`

const FileUpload = ({ control, formConfig }) => {
  const { options } = control;
  const { updateValue } = useContext(formRenderContext);

  return (
    <Wrapper>
      <Upload disabled={formConfig.disabled || options.disabled}>
        <Button>点击上传</Button>
      </Upload>
    </Wrapper>
  )
}

export default FileUpload
