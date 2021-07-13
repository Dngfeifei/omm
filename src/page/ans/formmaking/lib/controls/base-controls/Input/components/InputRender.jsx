import React, { useMemo, useContext } from 'react';
import { Input } from 'antd';
import styled from '@emotion/styled';
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps'

const InputRender = ({ control, formConfig, inTable = false, onChange, isDesign = false}) => {
  const { updateValue } = useContext(formRenderContext);
  const { options } = control;
  const baseProps = useFieldBaseProps(control, formConfig, false, inTable, onChange)

  return (
    <ControlAdapter control={control} inTable={inTable} isDesign={isDesign} formConfig={formConfig} onChange={onChange}>
      <div className={options.customClass}>
        <Container formConfig={formConfig}>
          <Label control={control} formConfig={formConfig} inTable={inTable} />
          {options.showPassword ? (
            <Input.Password
              {...baseProps}
              value={options.value}
            />
          ) : (
            <Input
              {...baseProps}
              value={options.value}
            />
          )}
        </Container>
      </div>
    </ControlAdapter>
  );
};

export default InputRender;
