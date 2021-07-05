import React, { useMemo } from 'react'
import { Radio } from 'antd'
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'

const RadioRender = ({ control, formConfig, inTable = false, onChange }) => {
  const { options } = control

  function createHtml() {
    return { __html: options.defaultValue };
  }

  return (
    <React.Fragment>
      {options.hidden ? null : (
        <div className={options.customClass}>
          <Container formConfig={formConfig}>
            <Label control={control} formConfig={formConfig} inTable={inTable} />

            <div dangerouslySetInnerHTML={createHtml()} />
          </Container>
        </div>
      )}
    </React.Fragment>
  )
}

export default RadioRender
