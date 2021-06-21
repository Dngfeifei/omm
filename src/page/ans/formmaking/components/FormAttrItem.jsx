import React from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  font-size: 14px;
  color: #606266;
  margin-bottom: 18px;
`
const FormLabel = styled.div`
  line-height: 32px;
`
const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: #e1e1e1;
  margin-top: 10px;
`

const Asterisk = styled.span`
  color: #f00;
`

const FormAttrItem = ({ label, required, children }) => {
  return <Container>
    <FormLabel>
      {required ? (<Asterisk>*</Asterisk>) : null}
      {label}
    </FormLabel>
    {children}
    <Line />
  </Container>
}

export default FormAttrItem
