import React, { useMemo } from 'react'
import { Container } from '@/page/ans/formmaking/lib/controls/components/styles'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import styled from "@emotion/styled";

const BlankWrapper = styled.div`
  flex: 1;
  height: 40px;
  padding: 0 20px;
  background-color: #eeeeee;
`

const BlankRender = ({ control, formConfig }) => {
  const { options } = control

  return <div className={options.customClass}>
    <Container formConfig={formConfig}>
      {/* <Label control={control} formConfig={formConfig} /> */}

      <BlankWrapper>
        自定义区域
      </BlankWrapper>
    </Container>

  </div>
}

export default BlankRender
