import React, { useMemo } from 'react';
import styled from '@emotion/styled';
import TableDesignWrap from './Design/TableDesignWrap';

const Container = styled.div`
  display: ${({ labelPosition }) =>
  labelPosition === 'top' ? 'block' : 'flex'};
`;
const Label = styled.div`
  width: ${({ labelWidth }) => labelWidth}px;
  text-align: ${({ labelPosition }) => labelPosition};
  vertical-align: middle;
  float: left;
  flex: 0 0 auto;
  font-size: 14px;
  color: #606266;
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  > span {
    color: #f56c6c;
    margin-right: 2px;
    font-size: 14px;
  }
`;
const ContentBox = styled.div`
  flex: 0 0 auto;
  width: ${({ labelWidth }) => `calc(100% - ${labelWidth}px)`};
  padding-bottom: 20px;
`;

const TableDesign = ({ control, formConfig }) => {
  const { options } = control;

  const labelWidth = useMemo(() => {
    if (options.isLabelWidth) {
      return options.labelWidth;
    }
    return formConfig.labelWidth;
  }, [options, formConfig]);

  return (
    <div className={options.customClass}>
      <Container labelPosition={formConfig.labelPosition}>
        {!options.hideLabel && (
          <Label
            labelPosition={formConfig.labelPosition}
            labelWidth={labelWidth}
          >
            {options.required && <span>*</span>}
            {control.name}
          </Label>
        )}
        <ContentBox labelWidth={labelWidth}>
          <TableDesignWrap control={control} />
        </ContentBox>
      </Container>
    </div>
  );
};

export default TableDesign;
