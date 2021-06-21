import React, { useMemo } from 'react'
import { Label, Container } from '../../../components/styles'
import styled from "@emotion/styled";
import {EditorModules, EditorFormats} from "./editor-config";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Wrapper = styled.div`
  flex: 1;
`

const EditorDesign = ({ control, formConfig }) => {
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
        <ReactQuill theme="snow"
                    value={options.defaultValue}
                    modules={EditorModules}
                    formats={EditorFormats}>
        </ReactQuill>
      </Wrapper>
    </Container>
  </div>
}

export default EditorDesign
