import React, { useEffect, useState } from "react";
import {Table, Button, Tooltip} from "antd";

export default function ListenerTable(props) {
  const [dataSource, setDataSource] = useState([]);
  const { editListener, deleteListener, listener = [] } = props;

  useEffect(() => {
    const data = listener.map((item, index) => {
      
      const obj = { event: item.event, key: index,customParams:item.fields === undefined?"":item.fields[0].string };
      if (item.class) {
        obj.implement = item.class;
        obj.listenerType = "class";
        obj.listenerTypeText = "类";
      } else if (item.expression) {
        obj.implement = item.expression;
        obj.listenerType = "expression";
        obj.listenerTypeText = "表达式";
      } else {
        obj.implement = item.delegateExpression;
        obj.listenerType = "delegateExpression";
        obj.listenerTypeText = "委托表达式";
      }
      return obj;
    });
    setDataSource(data);
  }, [listener]);

  const columns = [
    {
      title: "事件",
      dataIndex: "event",
      key: "event",
      width: 80,
    },
    {
      title: "类型",
      dataIndex: "listenerTypeText",
      key: "listenerTypeText",
      width: 80,
    },
    {
      title: "实现",
      dataIndex: "implement",
      key: "implement",
      width: 80,
      ellipsis: {
        showTitle: false,
      },
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },{
      title: "自定义参数",
      dataIndex: "customParams",
      key: "customParams",
      width: 80,
    },
    {
      title: "操作",
      key: "action",
      width: 80,
      render: (value, record, index) => (
        <div className="table-btn">
          <Button type="link" onClick={() => editListener(record, index)}>
            修改
          </Button>
          <Button
            type="link"
            style={{ marginLeft: 10 }}
            onClick={() => deleteListener(index)}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];
  return (
    <Table
      className="jxlTable"
      dataSource={dataSource}
      columns={columns}
      pagination={false}
      bordered
    />
  );
}
