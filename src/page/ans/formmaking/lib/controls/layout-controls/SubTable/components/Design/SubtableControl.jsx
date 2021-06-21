import React from 'react';
import ControlDesignBox from '@/page/ans/formmaking/components/ControlDesignBox.jsx';

const SubtableControl = ({ itemList, itemControl, dataIndex }) => {
  return (
    <div
    // className="formDesignDragHandle"
    // style={{ width: 200, flex: '0 0 auto' }}
    >
      <ControlDesignBox
        itemList={itemList}
        itemControl={itemControl}
        dataIndex={dataIndex}
      />
    </div>
  );
};

export default SubtableControl;
