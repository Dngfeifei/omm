import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import { Icon, InputNumber } from 'antd';
import { cloneDeep } from 'lodash';

const Container = styled.div`
  display: flex;
`;
const FLexCenter = styled.div``;

const FLexLeft = styled.div`
  line-height: 32px;
  font-size: 16px;
  padding: 0 10px;
`;

const FLexRight = styled.div`
  line-height: 34px;
  font-size: 20px;
  padding-left: 10px;
`;

const ColumnSetting = ({ column, columns, updateControl, responsive }) => {
  const { options } = column;

  const colSettingOpts = [
    {
      key: 'xs',
      px: '<768px',
    },
    {
      key: 'sm',
      px: '≥768px',
    },
    {
      key: 'md',
      px: '≥992px',
    },
    {
      key: 'lg',
      px: '≥1200px',
    },
    {
      key: 'xl',
      px: '≥1920px',
    },
  ];

  const updateColumnOptions = (params) => {
    const newOptions = { ...options, ...params };
    const newColumn = {
      ...column,
      options: newOptions,
    };
    const index = columns.findIndex((item) => item.id === column.id);
    const newColumns = cloneDeep(columns);
    newColumns[index] = newColumn;
    updateControl({ columns: newColumns });
  };

  const handleDeleteCol = () => {
    const newCols = cloneDeep(columns);
    const index = newCols.findIndex((col) => col.id === column.id);
    newCols.splice(index, 1);
    updateControl({ columns: newCols });
  };

  return (
    <Container>
      <FLexLeft>
        <Icon style={{ cursor: 'move' }} type="menu" />
      </FLexLeft>
      <FLexCenter>
        {responsive ? (
          colSettingOpts.map((opt) => (
            <div key={opt.key} style={{ marginBottom: 5 }}>
              <span style={{ display: 'inline-block', width: 30 }}>
                {opt.key}:
              </span>
              <InputNumber
                style={{ width: 100 }}
                min={1}
                max={24}
                precision={0}
                value={options[opt.key]}
                onChange={(e) => {
                  let n = e || 0;
                  if (isNaN(n)) n = 0;
                  if (n > 200) n = 200;
                  if (n < 0) n = 0;
                  updateColumnOptions({ [opt.key]: n });
                }}
              />
              <span style={{ marginLeft: 10 }}>{opt.px}</span>
            </div>
          ))
        ) : (
          <InputNumber
            style={{ width: 100 }}
            min={1}
            max={24}
            precision={0}
            value={options.span}
            onChange={(e) => {
              let n = e || 0;
              if (isNaN(n)) n = 0;
              if (n > 200) n = 200;
              if (n < 0) n = 0;
              updateColumnOptions({ span: n });
            }}
          />
        )}
      </FLexCenter>
      <FLexRight>
        <Icon
          style={{ cursor: 'pointer' }}
          type="minus-circle"
          theme="twoTone"
          twoToneColor="#eb2f96"
          onClick={handleDeleteCol}
        />
      </FLexRight>
    </Container>
  );
};

export default ColumnSetting;
