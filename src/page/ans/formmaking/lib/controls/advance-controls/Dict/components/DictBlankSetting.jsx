import React, { useMemo } from 'react';
import { Input, Switch, Select, Checkbox } from 'antd';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import FormAttrItem from '@/page/ans/formmaking/components/FormAttrItem.jsx';
import InputNumberPlus from '@/page/ans/formmaking/components/InputNumberPlus.jsx';
import useDictTypeList from "@/page/ans/formmaking/hooks/useDictTypeList";
const {Option} = Select
import CustomerClassSetting from '@/page/ans/formmaking/components/CustomerClassSetting';
import OnChangeSetting from '@/page/ans/formmaking/components/OnChangeSetting';

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

const DictBlankSetting = ({ control, updateFormModel }) => {
  const { options } = control;

  const dictTypeList = useDictTypeList()

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

      <FormAttrItem label="宽度">
        <Input
          value={options.width}
          onChange={(e) => {
            updateOptions({ width: e.target.value });
          }}
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

        <FormAttrItem label="字典类型">
          <Select style={{width: '100%'}}
                  value={options.dictType}
                  onChange={(value) => updateOptions({dictType: value})}>
            {dictTypeList.map((item, key) =>
              <Option value={item.value} key={key}>{item.label}:{item.value}</Option>
            )}
          </Select>
        </FormAttrItem>

      <FormAttrItem label="自定义Class">
        <CustomerClassSetting options={options} updateOptions={updateOptions} />
      </FormAttrItem>

      <FormAttrItem label="onChange">
        <OnChangeSetting options={options} updateOptions={updateOptions} />
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
          <div>
            <Checkbox
              checked={options.disabled}
              onChange={(e) => updateOptions({ disabled: e.target.checked })}
            >
              禁用
            </Checkbox>
          </div>
            <div>
                <Checkbox
                    checked={options.showScore}
                    onChange={(e) => updateOptions({ showScore: e.target.checked })}
                >
                    显示分数
                </Checkbox>
            </div>
        </WrapFlex>
      </FormAttrItem>

      <FormAttrItem label="校验">
        <div className={rowDiv}>
          <Checkbox
            checked={options.required}
            onChange={(e) => updateOptions({ required: e.target.checked })}
          >
            必填
          </Checkbox>
        </div>
      </FormAttrItem>
    </div>
  );
};

export default DictBlankSetting;
