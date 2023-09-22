import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import * as ModelUtil from 'bpmn-js/lib/util/ModelUtil'
import * as minDash from 'min-dash'

export default function (element) {

  return [
    {
      id: 'spell',
      element,
      component: PropertiesProp,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

export function PropertiesProp(props) {
  // console.log('props', props)
  const { element, id, attribute } = props;

  const modeling = useService('modeling');
  // const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    const { property } = element.businessObject
    if (!property) return ''

    const JSONproperty = JSON.parse(property)
    return JSONproperty[`${id}`] || ''
  }

  const aaa = (value) => {
    const clone = element.businessObject.property
    if (!clone) return {
      property: JSON.stringify({
        [`${id}`]: value
      })
    }

    const JSONclone = JSON.parse(clone)
    JSONclone[`${id}`] = value

    return {
      property: JSON.stringify(JSONclone)
    }
  }
  const setValue = value => {
    console.log('setvalue', value)
    return modeling.updateProperties(element, aaa(value));
  }

  return TextFieldEntry(
    {
      id,
      element,
      setValue,
      getValue,
      label: attribute.label,
      debounce: debounce
    }
  )
}
