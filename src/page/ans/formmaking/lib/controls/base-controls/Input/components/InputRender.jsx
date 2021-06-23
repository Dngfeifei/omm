import React, { useMemo, useContext } from 'react';
import { Input } from 'antd';
import styled from '@emotion/styled';
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';

const Container = styled.div`
  display: ${({ labelPosition }) =>
    labelPosition === 'top' ? 'block' : 'flex'};
`;
const Label = styled.div`
  width: ${({ labelWidth }) => labelWidth}px;
  text-align: ${({ labelPosition }) => labelPosition};
  vertical-align: middle;
  float: left;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  > span {
    color: #f56c6c;
    margin-right: 2px;
    font-size: 14px;
  }
`;
const InputBox = styled.div`
  flex: 1;
`;

const InputRender = ({ control, formConfig, inSubtable = false }) => {
  const { updateValue } = useContext(formRenderContext);
  const { options } = control;

  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth;
    }
    return formConfig.labelWidth;
  }, [options, formConfig]);

  return (
    <div className={options.customClass}>
      <Container labelPosition={formConfig.labelPosition}>
        {!inSubtable && !options.hideLabel && (
          <Label
            labelPosition={formConfig.labelPosition}
            labelWidth={labelWidth}
          >
            {options.required && <span>*</span>}
            {control.name}
          </Label>
        )}
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
      {/* <pre>{JSON.stringify(control, null, 2)}</pre> */}
    </div>
  );
};

export default InputRender;
