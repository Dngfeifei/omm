import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { Label as LabelDiv } from '@/page/ans/formmaking/lib/controls/components/styles'

const Label = ({ control, formConfig }) => {
  const { options } = control

  const labelWidth = useMemo(() => {
    return options.isLabelWidth ? options.labelWidth : formConfig.labelWidth
  }, [options.isLabelWidth, options.labelWidth, formConfig.labelWidth])

  return (
    <React.Fragment>
      {!options.hideLabel && <LabelDiv
        labelPosition={formConfig.labelPosition}
        labelWidth={labelWidth}
      >
        {options.required && <span>*</span>}
        {control.name}
      </LabelDiv>
      }
    </React.Fragment>
  )
}

export default Label
