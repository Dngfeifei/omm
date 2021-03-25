import React from 'react'
import { ConfigProvider } from 'antd'
// 页面出错后切换到的页面
import ErrorBoundary from '/page/error'
import zhCN from 'antd/es/locale/zh_CN';

const Page = props =>
    <ConfigProvider locale={zhCN}>
        <ErrorBoundary>{props.children}</ErrorBoundary>
            
    </ConfigProvider>

export default Page