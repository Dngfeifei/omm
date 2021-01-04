import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN';

const Page = props =>
    <ConfigProvider locale={zhCN}>
            {props.children}
    </ConfigProvider>

export default Page