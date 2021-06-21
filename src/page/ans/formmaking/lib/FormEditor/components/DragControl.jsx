import React, { useContext } from 'react';
import { ReactSortable } from 'react-sortablejs';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import genNewCtrl from '@/page/ans/formmaking/lib/utils/genNewCtrl';
import ControlDesignBox from '@/page/ans/formmaking/components/ControlDesignBox.jsx';

const DragControl = ({ formModel }) => {
  const { dispatch } = useContext(FormDesignContenxt);

  const updateFormModel = (newFormModel) => {
    dispatch({ type: 'update:form-model', payload: newFormModel });
  };

  return (
    <ReactSortable
      tag="div"
      className="formDesign"
      style={{ minHeight: 500 }}
      group={{ name: 'formDesign' }}
      ghostClass="sortable-ghost--form-design"
      handle=".formDesignDragHandle"
      animation={200}
      list={formModel}
      clone={(ctrl) => {
        if (ctrl.id) return ctrl;
        return genNewCtrl(ctrl.type);
      }}
      setList={(list) => {
        updateFormModel([...list]);
      }}
    >
      {formModel.map((item, index) => {
        return (
          <ControlDesignBox
            key={item.id}
            itemList={formModel}
            itemControl={item}
            dataIndex={index}
          />
        );
      })}
    </ReactSortable>
  );
};

export default DragControl;
