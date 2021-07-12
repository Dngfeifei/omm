import React, { useState, useContext } from 'react'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import styled from "@emotion/styled";
import {EditorModules, EditorFormats} from "./editor-config";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useFieldBaseProps from "@/page/ans/formmaking/hooks/useFieldBaseProps";
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'

const Wrapper = styled.div`
  flex: 1;
`

const EditorRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)
  const [value, setValue] = useState('')

  const handleChange = (val) => {
    setValue(val)
    baseProps.onChange(val);
  }

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={() => {}}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />

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
    </ControlAdapter>
  )
}

export default EditorRender
