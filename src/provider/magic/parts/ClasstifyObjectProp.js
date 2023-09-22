import { SelectEntry } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export function ClassifyObjectProp(props) {
  const modeling = useService('modeling');

  const { element } = props

  const getValue = () => {
    return element.businessObject.classify || ''
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      classify: value
    });
  }

  const getOptions = () => {
    const options = [
      {
        "value": "LEAD",
        "label": "Lead"
      },
      {
        "value": "OPPORTUNITY",
        "label": "Opportunity"
      }
    ]

    return options
  }

  return SelectEntry({
    element,
    setValue,
    getOptions,
    getValue,
    label: 'Đối tượng'
  })
}