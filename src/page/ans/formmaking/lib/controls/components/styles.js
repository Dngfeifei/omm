import styled from "@emotion/styled";

export const Container = styled.div`
  display: ${({ labelPosition }) => (labelPosition === 'top' ? 'block' : 'flex')};
`

export const Label = styled.div`
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
