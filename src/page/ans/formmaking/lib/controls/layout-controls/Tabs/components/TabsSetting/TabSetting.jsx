import React from 'react';
import styled from '@emotion/styled';
import { Input, Icon } from 'antd';
import { cloneDeep } from 'lodash';

const Container = styled.div`
  display: flex;
`;
const FLexCenter = styled.div``;

const FLexLeft = styled.div`
  line-height: 32px;
  font-size: 16px;
  padding: 0 10px;
`;

const FLexRight = styled.div`
  line-height: 34px;
  font-size: 20px;
  padding-left: 10px;
`;

const TabSetting = ({ tab, tabs, updateControl }) => {
  const updateTab = (params) => {
    const newTab = {
      ...tab,
      ...params,
    };
    const index = tabs.findIndex((item) => item.name === tab.name);
    const newTabs = cloneDeep(tabs);
    newTabs[index] = newTab;
    updateControl({ tabs: newTabs });
  };

  const handleDeleteCol = () => {
    const newTabs = cloneDeep(tabs);
    const index = newTabs.findIndex((t) => t.name === tab.name);
    newTabs.splice(index, 1);
    updateControl({ tabs: newTabs });
  };

  return (
    <Container>
      <FLexLeft>
        <Icon style={{ cursor: 'move' }} type="menu" />
      </FLexLeft>
      <FLexCenter>
        <Input
          value={tab.label}
          onChange={(e) => {
            updateTab({ label: e.target.value });
          }}
        />
      </FLexCenter>
      <FLexRight>
        <Icon
          style={{ cursor: 'pointer' }}
          type="minus-circle"
          theme="twoTone"
          twoToneColor="#eb2f96"
          onClick={handleDeleteCol}
        />
      </FLexRight>
    </Container>
  );
};

export default TabSetting;
