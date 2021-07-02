import {StarOutlined, StarFilled} from "@ant-design/icons";
import React from "react";
import styled from "@emotion/styled";
import _ from 'lodash'

const Container = styled.div`
    display: flex;
    align-items: center;
`
const Item = styled.div`
  display: flex;
  align-items: center;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};

`

const StarRate = ({max, value, disabled, onChange}) => {
    const stars = _.range(0, max).map((t,key) => ({
        active: key + 1 <= value
    }))
    const handleChange = (v) => {
      if (!disabled) {
        onChange && onChange(v)
      }
    }
    const styles = {marginRight: 5}
    return <Container>
        {stars.map((item, key)  =>
            <Item key={key} onClick={() => handleChange(key+1)} disabled={disabled}>
            {item.active ?
                <StarFilled style={{...styles, color: '#f7ba2a'}}  />:
                <StarOutlined style={{...styles, color: '#c6d1de'}} />}
            </Item>
        )}
    </Container>
}

export default StarRate
