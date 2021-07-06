import React from 'react'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import styled from "@emotion/styled";

const ComponentWrapper = styled.div`
  flex: 1;
  box-shadow: 0 4px 12px #ebedf0;
  height: 40px;
  padding: 0 20px;
`

const ComponentRender = ({ control, formConfig }) => {
  const { options } = control

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      {/* <Label control={control} formConfig={formConfig} /> */}

      <ComponentWrapper>
        自定义组件
      </ComponentWrapper>
    </Container>

  </div>
}

export default ComponentRender
