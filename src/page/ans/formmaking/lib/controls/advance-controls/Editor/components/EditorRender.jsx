import React, { useState, useContext } from 'react'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';
import styled from "@emotion/styled";
import {EditorModules, EditorFormats} from "./editor-config";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Wrapper = styled.div`
  flex: 1;
`

const EditorRender = ({ control, formConfig }) => {
  const { options } = control
  const { updateValue } = useContext(formRenderContext);
  const [value, setValue] = useState('')

  const handleChange = (val) => {
    setValue(val)
    updateValue(control.model, val);
  }

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      {/* <Label control={control} formConfig={formConfig} /> */}
      <Wrapper>
        <ReactQuill theme="snow"
                    value={value}
                    modules={EditorModules}
                    formats={EditorFormats}
                    onChange={handleChange}
                    readOnly={formConfig.disabled || options.disabled}
                    placeholder={options.placeholder}
                    >
        </ReactQuill>
      </Wrapper>
    </Container>

  </div>
}

export default EditorRender
