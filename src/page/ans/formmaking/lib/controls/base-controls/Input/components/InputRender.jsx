import React, { useMemo, useContext } from 'react';
import { Input } from 'antd';
import styled from '@emotion/styled';
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'


const InputBox = styled.div`
  flex: 1;
`;

const InputRender = ({ control, formConfig, inSubtable = false }) => {
  const { updateValue } = useContext(formRenderContext);
  const { options } = control;

  return (
    <div className={options.customClass}>
      <Container formConfig={formConfig}>
        {!inSubtable && <Label control={control} formConfig={formConfig} />}
        <InputBox>
          {options.showPassword ? (
            <Input.Password
              disabled={formConfig.disabled || options.disabled}
              defaultValue={options.defaultValue}
              style={{ width: options.width }}
              placeholder={options.placeholder}
              value={options.value}
              onChange={(e) => {
                updateValue(control.model, e.target.value);
              }}
            />
          ) : (
            <Input
              disabled={formConfig.disabled || options.disabled}
              defaultValue={options.defaultValue}
              style={{ width: options.width }}
              placeholder={options.placeholder}
              value={options.value}
              onChange={(e) => {
                updateValue(control.model, e.target.value);
              }}
            />
          )}
        </InputBox>
      </Container>
    </div>
  );
};

export default InputRender;
