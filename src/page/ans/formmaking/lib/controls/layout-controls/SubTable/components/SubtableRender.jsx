import React, { useMemo} from 'react';
import {Table } from 'antd';
import styled from '@emotion/styled'

import allComps from '@/page/ans/formmaking/lib/controls';


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

const SubtableRender = ({ control, formConfig }) => {
  const { options } = control

  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth
    }
    return formConfig.labelWidth
  }, [options, formConfig])


  const columns = useMemo(() => {
    const cols = [
      {
        title: '序号',
        dataIndex: 'key',
        fixed: 'left',
      },
    ];
    control.tableColumns.forEach((item) => {
      cols.push({
        title: item.name,
        dataIndex: item.id,
        render: (value, record) => {
          return (
            <div>
              {React.createElement(allComps[`${item.type}-render`], {
                control: item,
                formConfig: {},
                inTable: true,
              })}
            </div>
          );
        },
      });
    });
    return cols;
  }, [control]);


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
        dataSource={[{ key: '1' }]}
        pagination = {false}
       />
      </Wrapper>
      </Container>

  </div>
};

export default SubtableRender;
