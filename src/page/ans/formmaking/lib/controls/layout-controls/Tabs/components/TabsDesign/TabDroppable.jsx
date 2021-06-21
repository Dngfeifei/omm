import React, { useContext } from 'react';
import { ReactSortable } from 'react-sortablejs';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import genNewCtrl from '@/page/ans/formmaking/lib/utils/genNewCtrl';
import ControlDesignBox from '@/page/ans/formmaking/components/ControlDesignBox.jsx';

const TabDroppable = ({ tab, tabs }) => {
  const { state, dispatch } = useContext(FormDesignContenxt);

  return (
    <div>
      <ReactSortable
        tag="div"
        style={{ minHeight: 50 }}
        group={{ name: 'formDesign' }}
        ghostClass="sortable-ghost--form-design"
        handle=".formDesignDragHandle"
        animation={200}
        list={tab.list}
        clone={(ctrl) => {
          if (ctrl.id) return ctrl;
          return genNewCtrl(ctrl.type);
        }}
        setList={(list) => {
          tab.list = list;
          dispatch({
            type: 'update:form-model',
            payload: [...state.formModel],
          });
        }}
      >
        {tab.list.map((item, index) => {
          return (
            <ControlDesignBox
              key={item.id}
              itemList={tab.list}
              itemControl={item}
              dataIndex={index}
            />
          );
        })}
      </ReactSortable>
    </div>
  );
};

export default TabDroppable;
