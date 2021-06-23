import React from 'react';
import styled from '@emotion/styled';
import { Form, Input, Button } from 'antd';

const Container = styled.div`
  padding: 10px;
  border-bottom: 10px solid #ebeef4;
`;

const ItemStyle = styled.div`
  display: inline-block;
  margin-right: 10px;
`;

const SearchTools = (props) => {
  const { form, searchCtrls, search } = props;
  const { getFieldDecorator } = form;

  const handleSearch = () => {
    const values = form.getFieldsValue();
    search(values);
  };
  const handleReset = () => {
    form.resetFields();
    search({});
  };

  return (
    <div>
      <Container>
        <Form layout="inline">
          {searchCtrls.map((item) => {
            return (
              <ItemStyle key={item.model}>
                <Form.Item>
                  {getFieldDecorator(
                    item.model,
                    {}
                  )(<Input placeholder={item.name} />)}
                </Form.Item>
              </ItemStyle>
            );
          })}
          <ItemStyle>
            <Form.Item>
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
            </Form.Item>
          </ItemStyle>
          <ItemStyle>
            <Form.Item>
              <Button onClick={handleReset}>重置</Button>
            </Form.Item>
          </ItemStyle>
        </Form>
      </Container>
    </div>
  );
};

const WrappedForm = Form.create({ name: 'horizontal_login' })(SearchTools);

export default WrappedForm;
