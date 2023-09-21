import { isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import ObjectType from './objectType';
import Properties from './properties';

export default function (element) {

  return [
    {
      id: 'object',
      element,
      component: ObjectType,
      isEdited: isTextFieldEntryEdited
    },
    {
      id: 'properties',
      element,
      component: Properties,
      isEdited: isTextFieldEntryEdited
    }
  ];
}
