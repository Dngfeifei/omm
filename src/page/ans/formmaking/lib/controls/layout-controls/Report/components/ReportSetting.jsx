import React, { useMemo } from 'react';
import { Input, Switch, Select, Checkbox } from 'antd';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import ColorPicker from 'rc-color-picker';
import FormAttrItem from '@/page/ans/formmaking/components/FormAttrItem.jsx';
import InputNumberPlus from '@/page/ans/formmaking/components/InputNumberPlus.jsx';
import CustomerClassSetting from '@/page/ans/formmaking/components/CustomerClassSetting';

const WrapFlex = styled.div`
  display: flex;
  flex-flow: wrap;
  > div {
    flex: 1 0 auto;
    margin-bottom: 4px;
  }
`;
const rowDiv = css`
  margin-bottom: 4px;
`;

const ReportSetting = ({ control, updateFormModel }) => {
  const { options } = control;

  const defaultClass = useMemo(
    () => (options.customClass ? options.customClass.split(' ') : []),
    [options]
  );

  const updateControl = (params) => {
    const newControl = { ...control, ...params };
    updateFormModel(newControl);
  };

  const updateOptions = (params) => {
    const newOptions = { ...options, ...params };
    updateControl({ options: newOptions });
  };

  return (
    <div>
      <FormAttrItem label="字段标识">
        <Input
          disabled
          defaultValue={control.model}
          onChange={(e) => {
            updateControl({ model: e.target.value });
          }}
        />
      </FormAttrItem>

      <FormAttrItem label="宽度">
        <Input
          value={options.width}
          onChange={(e) => {
            updateOptions({ width: e.target.value });
          }}
        />
      </FormAttrItem>

      <FormAttrItem label="表格边框颜色">
        <ColorPicker
          color={options.borderColor}
          onChange={(color) => {
            updateOptions({ borderColor: color.color });
          }}
        />
      </FormAttrItem>

      <FormAttrItem label="表格边框宽度">
        <InputNumberPlus
          step={1}
          value={options.borderWidth}
          disabled={!options.borderWidth}
          onChange={(value) => updateOptions({ borderWidth: value })}
        />
      </FormAttrItem>

      <FormAttrItem label="自定义Class">
        <CustomerClassSetting options={options} updateOptions={updateOptions} />
      </FormAttrItem>

      <FormAttrItem label="操作属性">
        <WrapFlex>
          <div>
            <Checkbox
              checked={options.hidden}
              onChange={(e) => updateOptions({ hidden: e.target.checked })}
            >
              隐藏
            </Checkbox>
          </div>
        </WrapFlex>
      </FormAttrItem>
    </div>
  );
};

export default ReportSetting;
