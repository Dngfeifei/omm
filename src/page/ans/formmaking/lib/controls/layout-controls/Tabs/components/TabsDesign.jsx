import React, { useState } from 'react';
import { Tabs } from 'antd';
import { css } from '@emotion/css';
import TabDroppable from './TabsDesign/TabDroppable';

const { TabPane } = Tabs;

const TabContent = css`
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

const TabsDesign = ({ control, formConfig }) => {
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
                <div className={TabContent}>
                  <TabDroppable tab={item} tabs={tabs} />
                </div>
              </TabPane>
            );
          })}
        </Tabs>
      </div>
      {/* {tabs.map((item) => {
        return (
          <div key={item.name}>
            <div className={TabContent}>
              <TabDroppable tab={item} tabs={tabs} />
            </div>
          </div>
        );
      })} */}

      {/* <div>
        <pre>{JSON.stringify(control, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default TabsDesign;
