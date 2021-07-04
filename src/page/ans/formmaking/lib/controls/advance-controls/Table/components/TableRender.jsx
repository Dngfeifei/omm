import React, {useContext, useMemo, useState} from 'react';
import {Table, Button } from 'antd';
import {MinusCircleOutlined} from '@ant-design/icons'
import styled from '@emotion/styled'
import allComps from '@/page/ans/formmaking/lib/controls';
import formRenderContext from "@/page/ans/formmaking/lib/FormRender/formRenderContext";
import { cloneDeep } from 'lodash';

const Container = styled.div`
  display: ${({ labelPosition }) => (labelPosition === 'top' ? 'block' : 'flex')};
`
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
  > span{
    color: #f56c6c;
    margin-right: 2px;
    font-size: 14px;
  }
`
const Wrapper = styled.div`
  flex: 1;
`
const StyleSN = styled.div`
  position: relative
`

const TableRender = ({ control, formConfig }) => {
  const { updateValue } = useContext(formRenderContext);
  const { options } = control
  const { disabled } = formConfig
  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth
    }
    return formConfig.labelWidth
  }, [options, formConfig])
  const [dataSource, setDataSource] = useState([])
  const [values, setValues] = useState([])
  const handleDelete = (index) => {
    const copied = dataSource.slice(0)
    copied.splice(index, 1)
    setDataSource(copied)
  }
  const handleItemChange = (row, name, value) => {
    const copied = cloneDeep(values)
    copied[row] = copied[row] || {}
    copied[row][name] = value || ''
    setValues(copied)
    updateValue(control.model, copied)
  }
  const columns = useMemo(() => {
    const cols = [
      {
        title: '序号',
        dataIndex: 'key',
        fixed: 'left',
        render: (value, record, index) => {
          return <StyleSN>
            <span>{index+1}</span>
            {!disabled && <span onClick={() => handleDelete(index)}>
              <MinusCircleOutlined />
            </span>}
          </StyleSN>
        }
      },
    ];
    control.tableColumns.forEach((item) => {
      cols.push({
        title: item.name,
        dataIndex: item.id,
        render: (v, record, row) => {
          const value = (values[row] || {})[item.model]
          return (
            <div>
              {React.createElement(allComps[`${item.type}-render`], {
                control: {...item, options: {...item.options, value}},
                formConfig,
                onChange: (name, value) => handleItemChange(row, name, value),
                inTable: true,
              })}
            </div>
          );
        },
      });
    });
    return cols;
  }, [control, disabled, values]);
  const handleAddRow = () => {
    const copied = dataSource.slice(0)
    copied.push({})
    const mapper = (t, key) => ({...t, key})
    setDataSource(copied.map(mapper))
  }

  return <div className={options.customClass}>
    <Container labelPosition={formConfig.labelPosition}>
      {!options.hideLabel && <Label
        labelPosition={formConfig.labelPosition}
        labelWidth={labelWidth}
      >
        {options.required && <span>*</span>}
        {control.name}
      </Label>
      }
      <Wrapper>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination = {false}
        />
        {!disabled && <Button type="link" onClick={handleAddRow}>+ 添加</Button>}
      </Wrapper>
    </Container>

  </div>
};

export default TableRender;
