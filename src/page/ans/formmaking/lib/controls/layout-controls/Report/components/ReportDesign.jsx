import React, { useMemo } from 'react';
import { Input } from 'antd';
import styled from '@emotion/styled';
import { css } from '@emotion/css';
import Label from '@/page/ans/formmaking/lib/controls/common/Label';
import {
  Container,
  Space,
} from '@/page/ans/formmaking/lib/controls/components/styles';
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps';
import ControlAdapter from '@/page/ans/formmaking/lib/controls/common/ControlAdapter';
import CellDesign from '../Cell/CellDesign.jsx';
// import CellDraggable from './CellDraggable';

import { tableMutation } from '../utils.js';

const TableCls = css`
  width: 100%;
  border: 1px solid #333;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TdContainer = styled.td`
  border: ${({ borderColor = '#333', borderWidth = '1' }) =>
    `${borderWidth}px solid ${borderColor}`};
`;

const ReportDesign = ({
  control,
  formConfig,
  inTable = false,
  onChange,
  isDesign = false,
  updateFormModel,
}) => {
  const { options } = control;
  const baseProps = useFieldBaseProps(
    control,
    formConfig,
    false,
    inTable,
    onChange
  );

  const updateControl = (params) => {
    const newControl = { ...control, ...params };
    updateFormModel(newControl);
  };

  return (
    <table className={TableCls}>
      <tbody>
        {control.rows.map((row, index) => {
          return (
            <tr key={index}>
              {row.columns.map((column, colIndex) => {
                return (
                  <TdContainer
                    key={colIndex}
                    colSpan={column.options.colspan}
                    rowSpan={column.options.rowspan}
                    borderColor={control.options.borderColor}
                    borderWidth={control.options.borderWidth}
                  >
                    <CellDesign
                      column={column}
                      rowIndex={index}
                      columnIndex={colIndex}
                      updateControl={updateControl}
                      onOperation={(type, rowIndex, columnIndex) => {
                        updateControl({
                          ...control,
                          rows: tableMutation(
                            control.rows,
                            type,
                            rowIndex,
                            columnIndex
                          ),
                        });
                      }}
                    />
                  </TdContainer>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ReportDesign;
