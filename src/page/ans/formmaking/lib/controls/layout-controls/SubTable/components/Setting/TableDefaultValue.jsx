import React, { useMemo, useState } from 'react';
import { Modal, Button, Table } from 'antd';
import allComps from '@/page/ans/formmaking/lib/controls';

const TableDefaultValue = ({ control }) => {
  const [visible, setVisible] = useState(false);

  const columns = useMemo(() => {
    const cols = [
      {
        title: '序号',
        dataIndex: 'key',
        fixed: 'left',
      },
    ];
    control.tableColumns.forEach((item) => {
      cols.push({
        title: item.name,
        dataIndex: item.id,
        render: (value, record) => {
          return (
            <div>
              {React.createElement(allComps[`${item.type}-render`], {
                control: item,
                formConfig: {},
                inSubtable: true,
              })}
            </div>
          );
        },
      });
    });
    return cols;
  }, [control]);

  return (
    <div>
      <Button style={{ width: '100%' }} onClick={() => setVisible(true)}>
        设置
      </Button>

      <Modal
        title="默认值"
        width={900}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <Table columns={columns} dataSource={[{ key: '1' }]} />
      </Modal>
    </div>
  );
};

export default TableDefaultValue;
