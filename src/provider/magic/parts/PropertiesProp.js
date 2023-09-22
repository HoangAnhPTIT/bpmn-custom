import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

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
    console.log('element.businessObject', element.businessObject)
    const { property } = element.businessObject
    if (!property) return ''

    const JSONproperty = JSON.parse(property)
    return JSONproperty[`${id}`] || ''
  }

  const aaa = (value) => {
    const clone = element.businessObject.property
    if(!clone) return {
      property: JSON.stringify({
        [`${id}`]: value
      })
    }

    clone[`${id}`] = value

    return {
      property: JSON.stringify(clone)
    }
  }
  const setValue = value => {
    console.log('setvalue', value)
    return modeling.updateProperties(element, aaa());
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
