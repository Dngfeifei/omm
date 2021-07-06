import React, { useContext } from 'react';
import { css } from '@emotion/css';
import { ReactSortable } from 'react-sortablejs';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import genNewCtrl from '@/page/ans/formmaking/lib/utils/genNewCtrl';
import ControlDesignBox from '@/page/ans/formmaking/components/ControlDesignBox.jsx';

const ContentCls = css`
  min-height: 120px;
  background-color: #fff;
  border: 1px solid #ebeef5;
  display: flex;
`;

const LeftCls = css`
  width: 50px;
  flex: 0 0 auto;
`;
const RightCls = css`
  flex: 0 0 auto;
  border: 1px solid #ebeef5;
  min-height: 118px;
  width: calc(100% - 50px);
  overflow-x: auto;
`;

const TableDesignWrap = ({ control }) => {
  const { state, dispatch } = useContext(FormDesignContenxt);

  return (
    <div className={ContentCls}>
      <div className={LeftCls}>
        <div
          style={{
            backgroundColor: '#f6f7fa',
            borderBottom: '1px solid #ebeef5',
            lineHeight: '60px',
            paddingLeft: 10,
            color: '#666',
          }}
        >
          序号
        </div>
        <div style={{ lineHeight: '50px', paddingLeft: 10 }}>1</div>
      </div>
      <div className={RightCls}>
        <div>
          <ReactSortable
            tag="div"
            style={{
              minHeight: 120,
              display: 'flex',
            }}
            group={{ name: 'formDesign' }}
            ghostClass="sortable-ghost--subtable"
            handle=".formDesignDragHandle"
            // direction="horizontal"
            animation={200}
            list={control.tableColumns}
            clone={(ctrl) => {
              if (ctrl.id) return ctrl;
              ctrl.options.width = '200px';
              return genNewCtrl(ctrl.type);
            }}
            setList={(list) => {
              control.tableColumns = list;
              dispatch({
                type: 'update:form-model',
                payload: [...state.formModel],
              });
            }}
          >
            {control.tableColumns.map((item, index) => {
              return (
                <ControlDesignBox
                  key={item.id}
                  itemList={control.tableColumns}
                  itemControl={item}
                  dataIndex={index}
                  inTable
                />
              );
            })}
          </ReactSortable>
        </div>
      </div>
    </div>
  );
};

export default TableDesignWrap;
