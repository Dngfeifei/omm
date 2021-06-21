import {TimePicker} from "antd";
import React from "react";
import moment from "moment";
import styled from "@emotion/styled";
const Wrapper = styled.div`
    display: flex;
    align-items: center
`

const TimeRangePicker = ({defaultValue, onChange, options}) => {
    const value = defaultValue || []
    const [v1, v2] = value
    const onChange1 = (_, v) => onChange([v, v2])
    const onChange2 = (_, v) => onChange([v1, v])
    return <Wrapper>
        <TimePicker
            disabled={options.disabled}
            allowClear={options.clearable}
            onChange={onChange1}
            value={v1 ? moment(v1, 'HH:mm:ss'): null}
            format={options.format}
            style={{ width: options.width }}
            placeholder={options.placeholder}
        />
        <div>-</div>
        <TimePicker
            disabled={options.disabled}
            allowClear={options.clearable}
            onChange={onChange2}
            value={v2 ? moment(v2, 'HH:mm:ss'): null}
            format={options.format}
            style={{ width: options.width }}
            placeholder={options.placeholder}
        />
    </Wrapper>
}

export default TimeRangePicker
