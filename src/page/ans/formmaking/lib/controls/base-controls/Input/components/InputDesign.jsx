import React, { useMemo, Fragment } from 'react';
import { Input } from 'antd';
import styled from '@emotion/styled';
import { css } from '@emotion/css';

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

const TableHeaderCls = css`
  height: 60px;
  background-color: #f6f7fa;
  line-height: 60px;
  color: #999;
  padding-left: 10px;
  border-bottom: 1px solid #ebeef5;
`;

const TableCellCls = css`
  background-color: #fff;
  min-height: 60px;
  padding: 10px;
`;

const InputDesign = ({ control, formConfig, inSubtable }) => {
  const { options } = control;

  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth;
    }
    return formConfig.labelWidth;
  }, [options, formConfig]);

  const inputProps = {
    disabled: options.disabled,
    value: options.value,
    style: { width: options.width },
    placeholder: options.placeholder,
  };

  return (
    <Fragment>
      {inSubtable ? (
        <div>
          <div className={TableHeaderCls}>{control.name}</div>
          <div className={TableCellCls}>
            {options.showPassword ? (
              <Input.Password {...inputProps} />
            ) : (
              <Input {...inputProps} />
            )}
          </div>
        </div>
      ) : (
        <div className={options.customClass}>
          <Container labelPosition={formConfig.labelPosition}>
            {!options.hideLabel && (
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
                <Input.Password {...inputProps} />
              ) : (
                <Input {...inputProps} />
              )}
            </InputBox>
          </Container>
        </div>
      )}
    </Fragment>
  );
};

export default InputDesign;
