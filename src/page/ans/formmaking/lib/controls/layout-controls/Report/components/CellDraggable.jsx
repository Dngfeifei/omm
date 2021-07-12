import React, { useContext } from 'react';
import { ReactSortable } from 'react-sortablejs';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import genNewCtrl from '@/page/ans/formmaking/lib/utils/genNewCtrl';
import ControlDesignBox from '@/page/ans/formmaking/components/ControlDesignBox.jsx';

const CellDraggable = ({ column }) => {
  const { state, dispatch } = useContext(FormDesignContenxt);

  return (
    <ReactSortable
      tag="div"
      className="gridDesign"
      style={{ minHeight: 50 }}
      group={{ name: 'formDesign' }}
      ghostClass="sortable-ghost--form-design"
      handle=".formDesignDragHandle"
      animation={200}
      list={column.list}
      clone={(ctrl) => {
        if (ctrl.id) return ctrl;
        return genNewCtrl(ctrl.type);
      }}
      setList={(list) => {
        column.list = list;
        dispatch({ type: 'update:form-model', payload: [...state.formModel] });
      }}
    >
      {column.list.map((item, index) => {
        return (
          <ControlDesignBox
            key={item.id}
            itemList={column.list}
            itemControl={item}
            dataIndex={index}
          />
        );
      })}
    </ReactSortable>
  );
};

export default CellDraggable;
