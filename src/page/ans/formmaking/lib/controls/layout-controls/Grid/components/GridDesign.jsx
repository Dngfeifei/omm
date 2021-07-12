import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import ColumnDesign from '../Column/ColumnDesign';

const GridDesign = ({ control, formConfig }) => {
  const { options } = control;

  console.log('GridDesign', control);

  return (
    <div style={{ padding: 5 }}>
      <div className={options.customClass} style={{ display: 'flex' }}>
        {control.columns.map((column) => (
          <ColumnDesign column={column} gridControl={control} key={column.id} />
        ))}
      </div>
    </div>
  );
};

export default GridDesign;
