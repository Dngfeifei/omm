import React, { useMemo } from 'react'
import { Cascader } from 'antd'
import styled from '@emotion/styled'
import useFieldBaseProps from "@/page/ans/formmaking/hooks/useFieldBaseProps";
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const Wrapper = styled.div`
  flex: 1;
`

const CascaderRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />
          <Wrapper>
            <Cascader
              {...baseProps}
              options={options.options}
            />
          </Wrapper>
        </Container>
      </div>
    </ControlAdapter>
  )
}

export default CascaderRender
