import React, { useState, useContext } from 'react';
import { css } from '@emotion/css';
import { Form, Input, Button } from 'antd';
import formRenderContext from '@/page/ans/formmaking/lib/FormRender/formRenderContext';
import allComps from '@/page/ans/formmaking/lib/controls';

const ItemCss = css`
  margin-bottom: 18px;
`;

const TabContent = ({ controls, form }) => {
  const { getFieldDecorator } = form;
  const { state } = useContext(formRenderContext);

  return (
    <div>
      {controls.map((item, index) => {
        return (
          <div className={ItemCss} key={item.model}>
            <Form.Item>
              {getFieldDecorator(
                item.model,
                {}
              )(
                <div>
                  {React.createElement(allComps[`${item.type}-render`], {
                    control: item,
                    formConfig: state.formConfig,
                    form,
                  })}
                </div>
              )}
            </Form.Item>
          </div>
        );
      })}
    </div>
  );
};

export default TabContent;
