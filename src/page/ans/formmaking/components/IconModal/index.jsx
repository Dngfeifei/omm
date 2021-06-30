import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import {
  Modal,
  Button,
  Tabs,
  Icon,
} from 'antd';

import styled from "@emotion/styled";
import awesomeFonts from './data/icons2'
import antdIcons from './data/icons'

const IconItem = styled.li`
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #FFF;
  border: 1px solid #DCDFE6;
  color: ${({ active }) => active ? '#3a8ee6' : '#606266'};
  border-color: ${({ active }) => active ? '#3a8ee6' : '#606266' };
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  margin: 0 5px 5px 0;
  transition: .1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
`


const IconList = styled.ul`
  overflow: hidden;
  list-style: none;
  padding: 10px!important;
  border: 1px solid #eaeefb;
  border-radius: 4px;
`
const IconContainer = styled.div`
  max-height: 320px;
  over-flow: auto;
`


export default function IconModal(props) {

  const [tab, setTab] = useState('awesome')
  const [icon, setIcon] = useState(props.icon)


  const handleOk = () => {
    props.onChange(icon)
    props.onOk()
  };

  const handleCancel = () => {
    props.onCancel()
  };

  return (
    <Modal
      title="选择图标"
      visible={props.open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Tabs defaultActiveKey={tab} onChange={key => setTab(key)}>
        <Tabs.TabPane tab="Antd图标" key="antd">
          <IconContainer>
            <IconList>
              {antdIcons.map((type, index) => {
                return (
                  <IconItem key={index} active={icon === type} onClick={() => { setIcon(type) }}>
                    <Icon type={`${type}`}  />
                  </IconItem>
                )
              })}
            </IconList>
          </IconContainer>

        </Tabs.TabPane>
        <Tabs.TabPane tab="Font Awesome图标" key="awesome">
          <IconContainer>
            <IconList>
              {awesomeFonts.map((cls, index) => {
                return (
                  <IconItem key={index} active={icon === cls} onClick={() => { setIcon(cls) }}>
                    <i className={`${cls}`}></i>
                  </IconItem>
                )
              })}
            </IconList>
          </IconContainer>
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

IconModal.propTypes = {
  icon: PropTypes.string,
  open: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
}
