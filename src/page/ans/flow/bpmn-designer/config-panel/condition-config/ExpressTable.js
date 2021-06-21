import React, { useEffect, useState } from "react";
import { Table, Button, Input } from "antd";
import { getConditionExpress } from "../../services";
import { pagination } from "../../utils";


export default function ExpressTable(props) {
  const [dataSource, setDataSource] = useState([]);
  const [name, setName] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const [orderBy, setOrderBy] = useState("");
  const [total, setTotal] = useState(0);
  const { setExpress } = props;

  useEffect(() => {
    updateDataSource();
  }, [pageNo, pageSize, orderBy]);

  function updateDataSource() {
    const param = {
      name,
      pageNo,
      pageSize,
      orderBy,
    };
    getConditionExpress(param).then((data) => {
      const { list, count } = data;
      setDataSource(list.map((item) => ({ ...item, key: item.id })));
      setTotal(count);
    });
  }

  function handleTableChange(pagination, filters, sorter) {
    setPageSize(pagination.pageSize);
    setPageNo(pagination.current);
    setOrderBy(
      sorter.field && sorter.order ? sorter.field + " " + sorter.order : ""
    );
  }

  const onSelectChange = (selectedRowKeys, row) => {
    setExpress(row[0].expression);
  };

  const rowSelection = {
    type: "radio",
    onChange: onSelectChange,
  };

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: true,
    },
    {
      title: "表达式",
      dataIndex: "expression",
      key: "expression",
      width: 200,
      sorter: true,
    },
    {
      title: "备注",
      dataIndex: "remarks",
      key: "remarks",
      width: 200,
      sorter: true,
    },
  ];
  return (
    <div className="express-table">
      <div>
        <Input
          placeholder="名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button type="primary" onClick={updateDataSource}>
          查询
        </Button>
        <Button onClick={() => setName("")}>重置</Button>
      </div>
      <Table
        dataSource={dataSource}
        columns={columns}
        onChange={handleTableChange}
        rowSelection={rowSelection}
        borderd
        style={{ height: "100%" }}
        pagination={pagination(total)}
      />
    </div>
  );
}
