import React, { useMemo, useContext } from 'react';
import { Input } from 'antd';
import styled from '@emotion/styled';
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'


const InputBox = styled.div`
  flex: 1;
`;

const InputRender = ({ control, formConfig, inTable = false, onChange }) => {
  const { updateValue } = useContext(formRenderContext);
  const { options } = control;
  const handleChange = evt => (inTable ? onChange: updateValue)(control.model, evt.target.value)

  return (
    <div className={options.customClass}>
      <Container formConfig={formConfig}>
        {!inTable && <Label control={control} formConfig={formConfig} />}
        <InputBox>
          {options.showPassword ? (
            <Input.Password
              disabled={formConfig.disabled || options.disabled}
              defaultValue={options.defaultValue}
              style={{ width: options.width }}
              placeholder={options.placeholder}
              value={options.value}
              onChange={handleChange}
            />
          ) : (
            <Input
              disabled={formConfig.disabled || options.disabled}
              defaultValue={options.defaultValue}
              style={{ width: options.width }}
              placeholder={options.placeholder}
              value={options.value}
              onChange={handleChange}
            />
          )}
        </InputBox>
      </Container>
    </div>
  );
};

export default InputRender;
