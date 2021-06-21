import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import { Upload, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons';
import styled from "@emotion/styled";
import { css } from '@emotion/css';

const Wrapper = styled.div`
  width: 100px;
  height: 100px;
  border: 1px dashed #eaeaea;
  border-radius: 4px;
  position: relative;
  margin: 5px;
`
const iconCls = css`
  font-size: 24px;
  position: absolute;
  top: 40px;
  left: 40px;
`;


const ImageUploadDesign = ({ control, formConfig }) => {
  const { options } = control

  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth
    }
    return formConfig.labelWidth
  }, [options, formConfig])

  return <div className={options.customClass}>
    <Container labelPosition={formConfig.labelPosition}>
      {!options.hideLabel && <Label
        labelPosition={formConfig.labelPosition}
        labelWidth={labelWidth}
      >
        {options.required && <span>*</span>}
        {control.name}
      </Label>
      }
      <Wrapper>
        <PlusOutlined className={iconCls} />
      </Wrapper>
    </Container>
  </div>
}

export default ImageUploadDesign
