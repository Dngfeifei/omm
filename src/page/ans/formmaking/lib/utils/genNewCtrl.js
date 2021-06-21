import { cloneDeep } from 'lodash';
import {
  basicComps,
  advanceComps,
  layoutComps,
  gridColumn,
  TabsTab,
} from '@/page/ans/formmaking/lib/componentsConfig.js';
import { genNonDuplicateId } from '@/page/ans/formmaking/lib/utils';

const allComponents = [...basicComps, ...advanceComps, ...layoutComps];

const genNewCtrl = (type) => {
  const control = allComponents.find((item) => item.type === type);
  const newCtrl = cloneDeep(control);
  if (type === 'grid') return formatGridCtrl(newCtrl);
  newCtrl.model = newCtrl.id = `${newCtrl.type}_${genNonDuplicateId()}`;
  return newCtrl;
};

const formatGridCtrl = (control) => {
  control.id =
    control.key =
    control.model =
      `${control.type}_${genNonDuplicateId()}`;
  control.columns.forEach((item) => {
    item.id = item.key = `${item.type}_${genNonDuplicateId()}`;
  });
  return control;
};

export const genGridColumn = () => {
  const newCol = cloneDeep(gridColumn);
  newCol.id = newCol.key = `${newCol.type}_${genNonDuplicateId()}`;
  return newCol;
};

export const genTabsTab = (index) => {
  const newTab = cloneDeep(TabsTab);
  newTab.name = `tab_${genNonDuplicateId()}`;
  newTab.label = `标签页${index}`;
  return newTab;
};

export default genNewCtrl;
