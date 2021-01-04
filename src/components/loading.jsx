import React from 'react'
import { Spin } from 'antd'

const Loading = _ => 
    <div className='loadingWrapper'>
        <Spin size="large" />
    </div>

export default Loading