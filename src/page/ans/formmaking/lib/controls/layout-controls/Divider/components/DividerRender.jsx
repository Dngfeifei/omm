import React, { useMemo } from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
    display: block;
    height: 1px;
    width: 100%;
    margin: 24px 0;
    background-color: #DCDFE6;
    position: relative;
`
const Text = styled.div`
    left: ${({ contentPosition }) => {
    return {
      'left': '20px',
      'center': '50%',
      'right': 'none',
    }[contentPosition] }};
    right: ${
      ({ contentPosition }) => {
        return {
          'left': 'none',
          'center': 'none',
          'right': '20px',
        }[contentPosition]
      }
    };
    transform: translateY(-50%);
    position: absolute;
    background-color: #FFF;
    padding: 0 20px;
    color: #303133;
`

const DividerRender = ({ control, formConfig }) => {
  const { options } = control


  return  (
    <React.Fragment>
      {options.hidden ? null : (
        <Container>
          {control.name ? (
            <Text contentPosition={options.contentPosition}>{control.name}</Text>
          ) : null}
        </Container>
      )}
    </React.Fragment>
  )
}

export default DividerRender
