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
`

const StarRate = ({max, value, onChange}) => {
    const current = value > max ? max: value
    const stars = _.range(0, max).map((t,key) => ({
        active: key + 1 <= current
    }))
    const handleChange = (v) => {
        onChange && onChange(v)
    }
    const styles = {marginRight: 5}
    return <Container>
        {stars.map((item, key)  =>
            <Item key={key} onClick={() => handleChange(key+1)}>
            {item.active ?
                <StarFilled style={{...styles, color: '#f7ba2a'}}  />:
                <StarOutlined style={{...styles, color: '#c6d1de'}} />}
            </Item>
        )}
    </Container>
}

export default StarRate
