import styled from "@emotion/styled";

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
