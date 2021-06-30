import React from "react";
import { Upload, Button } from 'antd'
import styled from "@emotion/styled";

const Wrapper = styled.div`
  flex: 1;
`

const FileUpload = (props) => {

  return (
    <Wrapper>
      <Upload {...props}>
        <Button>点击上传</Button>
      </Upload>
    </Wrapper>
  )
}

export default FileUpload
