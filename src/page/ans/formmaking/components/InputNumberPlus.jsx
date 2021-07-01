import React from 'react';
import { Input, Icon } from 'antd';
import { css } from '@emotion/css';

const iconClass = css`
  cursor: pointer;
`;
const InputCss = css`
  width: 160px;
  text-align: center;
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

const InputNumberPlus = ({
  value,
  onChange,
  disabled,
  defaultValue = 0,
  step,
  min = 0,
  max = 100000 * 10000,
}) => {
  const defaultFn = () => {};
  const changeFn = onChange || defaultFn;
  const steps = step || 10;
  const handleMinus = () => {
    if (disabled) return;
    if (value <= min) {
      changeFn((value = min));
    } else {
      changeFn((value -= steps));
    }
  };
  const handlePlus = () => {
    if (disabled) return;
    if (value >= max) {
      changeFn((value = max));
    } else {
      changeFn((value += steps));
    }
  };

  const handleChange = (e) => {
    const v = Number(e.target.value);
    if (v <= min) {
      changeFn((value = min));
    } else if (value >= max) {
      changeFn((value = max));
    } else {
      changeFn(v);
    }
  };

  return (
    <div style={{ display: 'inline-block' }}>
      <Input
        disabled={disabled}
        className={InputCss}
        type="number"
        addonBefore={
          <Icon className={iconClass} onClick={handleMinus} type="minus" />
        }
        addonAfter={
          <Icon className={iconClass} onClick={handlePlus} type="plus" />
        }
        onChange={handleChange}
        value={value}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default InputNumberPlus;
