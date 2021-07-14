import React, { useMemo } from 'react'
import { Slider } from 'antd';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import styled from "@emotion/styled";
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const SliderWrapper = styled.div`
  flex: 1;
`

const SliderRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)


  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable}/>
          <SliderWrapper>
            <Slider
              {...baseProps}
              min={options.min}
              max={options.max}
              step={options.step}
              value={options.value || options.defaultValue}
            />
          </SliderWrapper>

        </Container>
      </div>
    </ControlAdapter>
  )
}

export default SliderRender
