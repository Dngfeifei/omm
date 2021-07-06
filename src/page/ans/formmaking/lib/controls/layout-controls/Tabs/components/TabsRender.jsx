import React, { useState } from 'react';
import { Tabs } from 'antd';
import { css } from '@emotion/css';
import TabContent from './TabsRender/TabContent';

const { TabPane } = Tabs;

const TabContentBox = css`
  min-height: 50px;
  min-width: 50px;
  border: 2px inset rgba(0, 0, 0, 0.1);
  background: #fff;
  margin-bottom: 5px;
`;

const resetCss = css`
  .ant-tabs-content {
    height: unset !important;
  }
`;

const TabsRender = ({ control, form, formConfig }) => {
  const { tabs, options } = control;
  const [defaultKey, setDefaultKey] = useState(tabs[0].name);

  return (
    <div>
      <div className={resetCss}>
        <Tabs
          defaultActiveKey={defaultKey}
          type={options.type}
          tabPosition={options.tabPosition}
          onChange={(key) => setDefaultKey(key)}
        >
          {tabs.map((item) => {
            return (
              <TabPane tab={item.label} key={item.name}>
                <TabContentBox>
                  <TabContent controls={item.list} form={form} />
                </TabContentBox>
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default TabsRender;
