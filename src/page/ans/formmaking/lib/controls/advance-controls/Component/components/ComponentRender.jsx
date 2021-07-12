import React from 'react'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import styled from "@emotion/styled";
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const ComponentWrapper = styled.div`
  flex: 1;
  box-shadow: 0 4px 12px #ebedf0;
  height: 40px;
  padding: 0 20px;
`

const ComponentRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />

          <ComponentWrapper>
            自定义组件
          </ComponentWrapper>
        </Container>
      </div>
    </ControlAdapter>
  )
}

export default ComponentRender
