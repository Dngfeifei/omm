import React, { useEffect } from 'react';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'


const TextRender = ({ control, formConfig, inTable = false, onChange, isDesign = false }) => {
  const { options } = control;
  const baseProps = useFieldBaseProps(control, formConfig, true, inTable, onChange)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />

          <div style={{ lineHeight: '32px' }}>{options.defaultValue}</div>
        </Container>
      </div>
    </ControlAdapter>

  );
};

export default TextRender;
