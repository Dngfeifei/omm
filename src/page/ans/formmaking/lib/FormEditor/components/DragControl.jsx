import React, { useContext, useCallback } from 'react';
import { ReactSortable } from 'react-sortablejs';
import FormDesignContenxt from '@/page/ans/formmaking/lib/formDesignContext';
import genNewCtrl from '@/page/ans/formmaking/lib/utils/genNewCtrl';
import ControlDesignBox from '@/page/ans/formmaking/components/ControlDesignBox.jsx';
import { cloneDeep } from 'lodash';

const DragControl = ({ formModel }) => {
  const { state, dispatch } = useContext(FormDesignContenxt);

  // 嵌套组件赋值
  const updateFormModel = useCallback(
    (ctrl) => {
      const flatFormModel = [state.formModel];

      for (const iterator of flatFormModel) {
        for (const [index, item] of iterator.entries()) {
          if (item.id === ctrl.id) {
            iterator[index] = ctrl;
            break;
          }
          for (const key in item) {
            if (Object.hasOwnProperty.call(item, key)) {
              if (Array.isArray(item[key])) flatFormModel.push(item[key]);
            }
          }
        }
      }
      dispatch({ type: 'update:form-model', payload: [...state.formModel] });
      dispatch({ type: 'update:selected-control', payload: cloneDeep(ctrl) });
    },
    [state]
  );

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
        dispatch({ type: 'update:form-model', payload: [...list] });
      }}
    >
      {formModel.map((item, index) => {
        return (
          <ControlDesignBox
            key={item.id}
            itemList={formModel}
            itemControl={item}
            dataIndex={index}
            updateFormModel={updateFormModel}
          />
        );
      })}
    </ReactSortable>
  );
};

export default DragControl;
