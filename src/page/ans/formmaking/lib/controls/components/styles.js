import styled from "@emotion/styled";
import { css } from '@emotion/css';

export const Container = styled.div`
  display: ${({ formConfig }) => (formConfig.labelPosition === 'top' ? 'block' : 'flex')};
  overflow-x: auto;
`

export const Label = styled.div`
  width: ${({ labelWidth }) => labelWidth}px;
  text-align: ${({ labelPosition }) => labelPosition};
  vertical-align: middle;
  float: ${({ labelPosition }) => (labelPosition === 'top' ? 'none' : 'left')};
  font-size: 14px;
  color: #606266;
  line-height: 32px;
  padding: 0 12px 0 0;
  box-sizing: border-box;
  white-space: nowrap;
  > span{
    color: #f56c6c;
    margin-right: 2px;
    font-size: 14px;
  }
`

export const Space = styled.div`
  display: flex;
  flex-direction: ${props => {
    return props.control.options.inline ? 'row' : 'column'
  }};
`

export const Flex = styled.div`
  display: flex;
  flex-direction: ${props => {
    return props.flexDirection ? props.flexDirection : 'row'
  }};
  align-items:${props => {
    return props.alignItems ? props.alignItems : "center"
  }};
  justify-content: ${props => {
    return props.justifyContent ? props.justifyContent : 'center'
  }};
`

export const TableHeaderCls = css`
  height: 60px;
  background-color: #f6f7fa;
  line-height: 60px;
  color: #999;
  padding-left: 10px;
  border-bottom: 1px solid #ebeef5;
`;

export const TableCellCls = css`
  background-color: #fff;
  min-height: 60px;
  padding: 10px;
`;
