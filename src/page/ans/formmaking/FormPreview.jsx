import React, { useEffect, useMemo, useState, useRef } from 'react';
import { Button, Table, Modal, message } from 'antd';
import styled from '@emotion/styled';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {
  queryByIdMakeForm,
  listGenerateForm,
  saveGenerateFormApi,
  deleteGenerateFormApi,
} from '/api/form';
import FormRender from '@/page/ans/formmaking/lib/FormRender';
import SearchTools from './FormPreview/SearchTools';

const TableTool = styled.div`
  dispaly: flex;
  margin-bottom: 10px;
`;
const TableToolLeft = styled.div`
  > span {
    margin-right: 10px;
  }
`;

const FormPreview = ({ params }) => {
  const { type: formId } = params;
  const modelRef = useRef();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [formInfo, setFormInfo] = useState({});
  const [formModel, setFormModel] = useState([]);
  const [formConfig, setFormConfig] = useState({});
  const [total, setTotal] = useState(0);
  const [requestParams, setRequestParams] = useState({
    formId,
    orderBy: '',
    params: '{}',
    pageNo: 1,
    pageSize: 10,
  });
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [visible, setVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [recordId, setRecordId] = useState(undefined);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys,
  };

  useEffect(() => {
    queryByIdMakeForm({ id: formId }).then((res) => {
      if (res.code == 200) {
        setFormInfo(res.form);
        const source = res.form.source;
        if (source) {
          const { list } = JSON.parse(source);
          const cusColums = list.map((item) => {
            return {
              title: item.name,
              dataIndex: item.model,
            };
          });
          setColumns(cusColums);
          setFormModel([...list]);
        }
      }
    });
  }, []);

  useEffect(() => {
    handleSearch();
  }, []);

  const handleSearch = (params) => {
    let newParams = { ...requestParams };
    if (params) newParams.params = JSON.stringify(params);
    listGenerateForm(newParams).then((res) => {
      if (res.code === 200) {
        const { list, count } = res.page;
        setTotal(count);
        setDataSource(list);
      }
    });
  };

  const searchCtrls = useMemo(() => {
    return formModel.filter((item) => item.type === 'input');
  }, [formModel]);

  const handleUpdateData = () => {
    if (modalType === 'check') {
      setVisible(false);
      return;
    }
    const values = modelRef.current.getFieldsValue();
    if (modalType === 'edit') values.id = recordId;
    const params = {
      formId,
      data: JSON.stringify(values),
    };
    saveGenerateFormApi(params).then((res) => {
      if (res.code === 200) {
        message.success(res.msg);
        handleSearch();
        setVisible(false);
      }
    });
  };

  const formatModel = (record) => {
    const { list, config } = JSON.parse(formInfo.source);
    if (!record) return { list, config };
    setRecordId(record.id);
    const newList = [...list];
    for (const item of newList) {
      if (typeof item !== 'object') continue;
      if (item.model && record[item.model]) {
        item.options.value = record[item.model];
      }
      for (const key in item) {
        if (Object.hasOwnProperty.call(item, key)) {
          if (Array.isArray(item[key])) {
            newList.push(...item[key]);
          }
        }
      }
    }
    return { list, config };
  };

  const handleShowModal = (type, record) => {
    setModalType(type);
    const { list, config } = formatModel(record);
    if (type === 'check') config.disabled = true;
    setFormModel([...list]);
    setFormConfig({ ...config });
    setVisible(true);
  };

  const handleDelete = (ids) => {
    if (!ids.length) return;
    Modal.confirm({
      title: '确定要删除所选项吗?',
      icon: <ExclamationCircleOutlined />,
      onOk: async () => {
        return deleteGenerateFormApi({
          formId,
          ids: ids.join(','),
        }).then((res) => {
          message.success(res.msg);
          handleSearch();
        });
      },
    });
  };

  return (
    <div>
      <SearchTools
        searchCtrls={searchCtrls}
        search={handleSearch}
      ></SearchTools>
      <div style={{ padding: 20 }}>
        <TableTool>
          <TableToolLeft>
            <span>
              <Button type="primary" onClick={() => handleShowModal('create')}>
                新建
              </Button>
            </span>
            {/* <span>
              <Button type="default">修改</Button>
            </span> */}
            <span>
              <Button
                type="danger"
                disabled={!selectedRowKeys.length}
                onClick={() => handleDelete(selectedRowKeys)}
              >
                删除
              </Button>
            </span>
          </TableToolLeft>
        </TableTool>
        <div>
          <Table
            rowKey="id"
            rowSelection={rowSelection}
            columns={[
              ...columns,
              {
                title: '操作',
                width: 200,
                render: (text, record) => (
                  <span>
                    <span>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => handleShowModal('check', record)}
                      >
                        查看
                      </Button>
                    </span>
                    <span>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => handleShowModal('edit', record)}
                      >
                        修改
                      </Button>
                    </span>
                    <span>
                      <Button
                        size="small"
                        type="link"
                        onClick={() => handleDelete([record.id])}
                      >
                        删除
                      </Button>
                    </span>
                  </span>
                ),
              },
            ]}
            dataSource={dataSource}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: (t) => `共 ${t} 条`,
              total: total,
              pageSize: requestParams.pageSize,
              current: requestParams.pageNo,
              pageSizeOptions: ['10', '20', '50', '100'],
              onChange: (page, pageSize) => {
                const newParams = { ...requestParams, pageNo: page };
                setRequestParams(newParams);
                handleSearch(newParams);
              },
              onShowSizeChange: (current, size) => {
                const newParams = {
                  ...requestParams,
                  pageSize: size,
                  pageNo: 1,
                };
                setRequestParams(newParams);
                handleSearch(newParams);
              },
            }}
          />
        </div>
      </div>
      <Modal
        title="新建"
        width={720}
        maskClosable={false}
        visible={visible}
        onOk={handleUpdateData}
        onCancel={() => setVisible(false)}
      >
        {visible && (
          <FormRender
            ref={modelRef}
            formModel={formModel}
            formConfig={formConfig}
          />
        )}
      </Modal>
    </div>
  );
};

export default FormPreview;
