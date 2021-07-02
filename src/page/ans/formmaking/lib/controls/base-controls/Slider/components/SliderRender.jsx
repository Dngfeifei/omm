import React, { useMemo } from 'react'
import { Slider } from 'antd';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import styled from "@emotion/styled";

const SliderWrapper = styled.div`
  flex: 1;
`

const SliderRender = ({ control, formConfig }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true)


  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      <Label control={control} formConfig={formConfig} />
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
}

export default SliderRender
