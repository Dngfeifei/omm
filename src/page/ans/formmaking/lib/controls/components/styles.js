import styled from "@emotion/styled";

export const Container = styled.div`
  display: ${({ formConfig }) => (formConfig.labelPosition === 'top' ? 'block' : 'flex')};
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
