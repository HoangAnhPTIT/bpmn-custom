import { html } from 'htm/preact';

import { SelectEntry } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';


export default function Properties(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.object_type || '';
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      object_type: value
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

  return html`<div>
    <${SelectEntry}
    element=${element}
    description=${translate('Chọn thuộc tính')}
    label=${translate('Thuộc tính')}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
    getOptions=${getOptions}
  />
  </div>`
}
