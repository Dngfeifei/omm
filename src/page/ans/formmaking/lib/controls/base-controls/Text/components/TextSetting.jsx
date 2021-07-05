import React, { useMemo } from 'react';
import { Input, Switch, Select, Checkbox, AutoComplete } from 'antd';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import FormAttrItem from '@/page/ans/formmaking/components/FormAttrItem.jsx';
import InputNumberPlus from '@/page/ans/formmaking/components/InputNumberPlus.jsx';

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

const recommendList = [{
  title: "姓名",
  value: "${user.name}"
}, {
  title: "用户id",
  value: "${user.id}"
}, {
  title: "登录名",
  value: "${user.loginName}"
}, {
  title: "工号",
  value: "${user.no}"
}, {
  title: "公司",
  value: "${user.company.name}"
}, {
  title: "公司id",
  value: "${user.company.id}"
}, {
  title: "部门",
  value: "${user.office.name}"
}, {
  title: "部门id",
  value: "${user.office.id}"
}, {
  title: "当前日期",
  value: "${new Date()}"
}]

const TextSetting = ({ control, updateFormModel }) => {
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
          value={control.model}
          onChange={(e) => {
            updateControl({ model: e.target.value });
          }}
        />
      </FormAttrItem>

      <FormAttrItem label="标题">
        <Input
          value={control.name}
          onChange={(e) => {
            updateControl({ name: e.target.value });
          }}
          allowClear
        />
      </FormAttrItem>

      <FormAttrItem label="标签宽度">
        <Checkbox
          style={{ lineHeight: '32px', float: 'left' }}
          checked={options.isLabelWidth}
          onChange={(e) => updateOptions({ isLabelWidth: e.target.checked })}
        >
          自定义
        </Checkbox>
        <InputNumberPlus
          value={options.labelWidth}
          disabled={!options.isLabelWidth}
          onChange={(value) => updateOptions({ labelWidth: value })}
        />
      </FormAttrItem>

      <FormAttrItem label="隐藏标签">
        <Switch
          checked={options.hideLabel}
          onChange={(checked) => updateOptions({ hideLabel: checked })}
        />
      </FormAttrItem>

        <FormAttrItem label="默认值">
          <AutoComplete
            value={options.defaultValue}
            onChange={(value) => updateOptions({ defaultValue: value })}
          >
            {recommendList.map(item => {
              return <AutoComplete.Option key={item.value} value={item.value}>{item.value}</AutoComplete.Option>
            })}
          </AutoComplete>
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

      <FormAttrItem label="操作属性">
        <WrapFlex>
          <div>
            <Checkbox
              checked={options.dataBind}
              onChange={(e) => updateOptions({ dataBind: e.target.checked })}
              disabled
            >
              数据绑定
            </Checkbox>
          </div>
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

export default TextSetting;
