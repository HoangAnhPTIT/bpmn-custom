import { html } from 'htm/preact';

import { SelectEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function (element) {

  return [
    {
      id: 'spell',
      element,
      component: Spell,
      isEdited: isTextFieldEntryEdited
    }
  ];
}

function Spell(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.spell || '';
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      spell: value
    });
  }

  const getOptions = () => {
    const options = [
      {
        "value": "1",
        "label": "First"
      },
      {
        "value": "2",
        "label": "Seconds"
      },
      {
        "value": "33",
        "label": "Third"
      },
    ]

    return options
  }

  return html`<${SelectEntry}
    id=${id}
    element=${element}
    description=${translate('Apply a black magic spell')}
    label=${translate('Spell')}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
    getOptions=${getOptions}
  />`
}
