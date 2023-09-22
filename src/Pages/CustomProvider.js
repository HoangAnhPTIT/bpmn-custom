
import { Group, CheckboxEntry, isSelectEntryEdited, isTextFieldEntryEdited, ListGroup } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import { html } from 'htm/preact';
import * as ModelUtil from 'bpmn-js/lib/util/ModelUtil'
import { PropertiesProp } from '../provider/magic/parts/PropertiesProp';
import { ClassifyObjectProp } from '../provider/magic/parts/ClasstifyObjectProp';

// import * as ModelingUtil from 'bpmn-js/lib/util/'

const LOW_PRIORITY = 500;
const CAMUNDA_PLATFORM_GROUPS = [PropertiesGroup, ClassifyObjectGroup];

class CustomProvider {
  constructor(propertiesPanel, injector) {
    propertiesPanel.registerProvider(LOW_PRIORITY, this);
    this._injector = injector;
  }
  getGroups(element) {

    return groups => {
      groups = groups.concat(this._getGroups(element))
      console.log('first', this._getGroups(element))

      return groups;
    }
  }

  _getGroups(element) {
    const groups = CAMUNDA_PLATFORM_GROUPS.map(createGroup => createGroup(element))

    // contract: if a group returns null, it should not be displayed at all
    return groups.filter(group => group !== null);
  }
}

CustomProvider.$inject = ['propertiesPanel', 'injector'];

function PropertiesGroup(element) {
  // const translate = useService('translate');
  // const modeling = useService('modeling');
  if(!ModelUtil.is(element, "bpmn:Task")) return null

  const attributes = [
    {
      code: 'lead_name',
      label: 'Tên lead'
    },
    {
      code: 'SDT',
      label: 'SDT'
    },
    {
      code: 'booking_code',
      label: 'Mã booking'
    },
    {
      code: 'order_code',
      label: 'Mã order'
    },
  ]

  const group = {
    label: 'Danh sách thuộc tính',
    id: 'CamundaPlatform__Tasklist',
    entries: attributes.map(attribute => {
      return {
        id: attribute.code,
        element,
        component: PropertiesProp,
        attribute: attribute,
        isEdited: isTextFieldEntryEdited
      }
    })
  };

  if (group.entries.length) {
    return group;
  }
  return null;
}

function ClassifyObjectGroup(element){
  if(!ModelUtil.is(element, "bpmn:Task")) return null

  const group = {
    label: 'Đối tượng',
    id: 'ClassifyObjectGroup_Id',
    entries: [
      {
        id: 'classifsy',
        element,
        component: ClassifyObjectProp,
        isEdited: isSelectEntryEdited
      }
    ]
  }
  if(!group.entries.length) return null

  return group
}



export default {
  __init__: ['customProvider'],
  customProvider: ['type', CustomProvider]
};
