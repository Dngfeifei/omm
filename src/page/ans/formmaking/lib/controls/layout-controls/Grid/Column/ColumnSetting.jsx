import React, { useMemo } from 'react';
import { Input, Switch, Select, Checkbox } from 'antd';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import FormAttrItem from '@/page/ans/formmaking/components/FormAttrItem.jsx';
import InputNumberPlus from '@/page/ans/formmaking/components/InputNumberPlus.jsx';

const ColumnSetting = ({ control, updateFormModel }) => {
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
      <FormAttrItem label="栅格占据的列数">
        <InputNumberPlus
          step={1}
          max={24}
          value={options.span}
          onChange={(value) => updateOptions({ span: value })}
        />
      </FormAttrItem>

      <FormAttrItem label="栅格左侧的间隔数">
        <InputNumberPlus
          step={1}
          max={24}
          value={options.offset}
          onChange={(value) => updateOptions({ offset: value })}
        />
      </FormAttrItem>

      <FormAttrItem label="栅格向右移动格数">
        <InputNumberPlus
          step={1}
          max={24}
          value={options.push}
          onChange={(value) => updateOptions({ push: value })}
        />
      </FormAttrItem>

      <FormAttrItem label="栅格向左移动格数">
        <InputNumberPlus
          step={1}
          max={24}
          value={options.pull}
          onChange={(value) => updateOptions({ pull: value })}
        />
      </FormAttrItem>

      <FormAttrItem label="自定义Class">
        <Select
          mode="tags"
          style={{ width: '100%' }}
          placeholder="请选择"
          value={defaultClass}
          onChange={(value) => updateOptions({ customClass: value.join(' ') })}
        ></Select>
      </FormAttrItem>
    </div>
  );
};

export default ColumnSetting;
