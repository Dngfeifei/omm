import React, {useContext, useMemo, useState} from 'react';
import {Table, Button } from 'antd';
import {MinusCircleOutlined} from '@ant-design/icons'
import styled from '@emotion/styled'
import allComps from '@/page/ans/formmaking/lib/controls';
import formRenderContext from "@/page/ans/formmaking/lib/FormRender/formRenderContext";
import { cloneDeep } from 'lodash';
import Label from '@/page/ans/formmaking/lib/controls/common/Label'
import { Container, Space } from '@/page/ans/formmaking/lib/controls/components/styles'
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter'



const Wrapper = styled.div`
  flex: 1;
`
const StyleSN = styled.div`
  position: relative
`

const TableRender = ({ control, formConfig }) => {
  const { updateValue } = useContext(formRenderContext);
  const { options } = control
  // const { disabled } = formConfig
  const disabled = formConfig.disabled || control.options.disabled


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

  return (
    <ControlAdapter control={control} inTable={false} isDesign={false} formConfig={formConfig} onChange={() => {}}>
    <div className={options.customClass}>
      <Container formConfig={formConfig}>
        <Label control={control} formConfig={formConfig} inTable={false} />

        <Wrapper>
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
          {!disabled && <Button type="link" onClick={handleAddRow}>+ 添加</Button>}
        </Wrapper>
      </Container>

    </div>
    </ControlAdapter>

  )
};

export default TableRender;
