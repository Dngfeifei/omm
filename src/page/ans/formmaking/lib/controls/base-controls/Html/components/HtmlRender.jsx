import React, { useMemo } from 'react'
import { Radio } from 'antd'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'

const HtmlRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control

  function createHtml() {
    return { __html: options.defaultValue };
  }

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />

          <div dangerouslySetInnerHTML={createHtml()} />
        </Container>
      </div>
    </ControlAdapter>
  )
}

export default HtmlRender
