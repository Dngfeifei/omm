import React, { useMemo } from 'react';
import { Input } from 'antd';
import { css } from '@emotion/css';
import useFieldBaseProps from '@/page/ans/formmaking/hooks/useFieldBaseProps';
import CellRender from '../Cell/CellRender.jsx';

const ReportRender = ({
  control,
  formConfig,
  inTable = false,
  onChange,
  isDesign = false,
  form = {},
}) => {
  const { options } = control;
  const baseProps = useFieldBaseProps(
    control,
    formConfig,
    false,
    inTable,
    onChange
  );

  const TableCls = css`
    width: ${options.width || '100%'};
    border: ${options.borderWidth || 1}px solid ${options.borderColor};
    border-collapse: collapse;
    table-layout: fixed;
  `;

  const TdCls = css`
    border: ${options.borderWdith || 1}px solid ${options.borderColor};
  `;

  const CellContentBox = css`
    max-width: 100%;
    overflow: auto;
  `;

  return (
    <table className={TableCls}>
      <tbody>
        {control.rows.map((row, index) => {
          return (
            <tr key={index}>
              {row.columns.map((column, colIndex) => {
                return (
                  <td
                    key={colIndex}
                    className={TdCls}
                    colSpan={column.options.colspan}
                    rowSpan={column.options.rowspan}
                  >
                    <div className={CellContentBox}>
                      <CellRender controls={column.list} form={form} />
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default ReportRender;
