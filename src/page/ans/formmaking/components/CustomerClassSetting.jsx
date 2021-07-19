import React, { useEffect, useState, useContext } from 'react';
import { Select } from 'antd';
import { getClassList } from '@/page/ans/formmaking/lib/utils/index'
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';

const CustomerClassSetting = ({
  options,
  updateOptions,
}) => {
  const defaultClass = options.customClass ? options.customClass.split(' ') : []
  const { state, dispatch } = useContext(FormDesignContenxt);
  const classList = getClassList(state.formConfig.styleSheets)

  return (
    <Select
      mode="tags"
      style={{ width: '100%' }}
      placeholder="请选择"
      defaultValue={defaultClass}
      onChange={
        value => updateOptions({ customClass: value.join(' ') })
      }
    >
      {classList.map((cls, index) => {
        return <Select.Option key={index} value={cls}>{cls}</Select.Option>
      })}
    </Select>
  );
};

export default CustomerClassSetting
