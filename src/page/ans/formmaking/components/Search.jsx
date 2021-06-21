import {Button, Input} from "antd";
import React from "react";

const Search = (props) = <div className="mgrSearchBar">
    <div className="mb20 w200">
        <Input.Search
            width={200}
            enterButton="搜索"
            value={props.value}
            onChange={props.onChange}
            onSearch={props.onSearch}
        />
    </div>
    <div className="mb20">
        <Button
            onClick={props.onAdd}
            type="primary"
            className="mr20"
        >
            新增
        </Button>
        <Button onClick={props.onDeleteAll}>删除</Button>
    </div>
</div>

export default Search
