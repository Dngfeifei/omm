import React, { useMemo, Fragment } from 'react';
import { Input } from 'antd';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'


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
            <Container formConfig={formConfig}>
            <Label control={control} formConfig={formConfig} />
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
