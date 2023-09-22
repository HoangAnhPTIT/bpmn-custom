/* eslint-disable react/prop-types */
import { TextFieldEntry, SelectEntry } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import * as ModelUtil from 'bpmn-js/lib/util/ModelUtil'
import * as minDash from 'min-dash'
import { createElement } from '../utils';

export default function ExPropertiesProps({
  element,
  injector,
  namespace = 'camunda'
}) {
  let businessObject = getRelevantBusinessObject(element);

  if(!ModelUtil.is(businessObject, 'bpmn:Task')) return null;

  // do not offer for empty pools
  if (!businessObject) {
    return;
  }
  const properties = getPropertiesList(businessObject, namespace) || [];
  const bpmnFactory = injector.get('bpmnFactory'),
    commandStack = injector.get('commandStack');
  const items = properties.map((property, index) => {
    const id = element.id + '-extensionProperty-' + index;
    return {
      id,
      label: property.get('name') || '',
      entries: ExtensionProperty({
        idPrefix: id,
        element,
        property
      }),
      autoFocusEntry: id + '-name',
      remove: removeFactory$9({
        commandStack,
        element,
        property,
        namespace
      })
    };
  });
  return {
    items,
    add: addFactory$6({
      bpmnFactory,
      commandStack,
      element,
      namespace
    }),
    shouldSort: false
  };
}

// helper //////////////////


function ExtensionProperty(props) {
  const {
    idPrefix,
    property
  } = props;
  const entries = [{
    id: idPrefix + '-name',
    component: NameProperty$1,
    idPrefix,
    property
  },
  {
    id: idPrefix + '-value',
    component: ValueProperty$1,
    idPrefix,
    property
  }];
  return entries;
}


function NameProperty$1(props) {
  const {
    idPrefix,
    element,
    property
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: property,
      properties: {
        name: value
      }
    });
  };
  const getValue = () => {
    return property.name;
  };

  const getOptions = () => {
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

    return attributes
  }

  return SelectEntry({
    element: property,
    id: idPrefix + '-name',
    label: translate('Name'),
    getValue,
    setValue,
    debounce,
    getOptions
  });
}
function ValueProperty$1(props) {
  const {
    idPrefix,
    element,
    property
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: property,
      properties: {
        value
      }
    });
  };
  const getValue = () => {
    return property.value;
  };
  return TextFieldEntry({
    element: property,
    id: idPrefix + '-value',
    label: translate('Value'),
    getValue,
    setValue,
    debounce
  });
}


function removeFactory$9({
  commandStack,
  element,
  property,
  namespace
}) {
  return function (event) {
    event.stopPropagation();
    const commands = [];
    const businessObject = getRelevantBusinessObject(element);
    const extensionElements = businessObject.get('extensionElements');
    const properties = getProperties(businessObject, namespace);
    if (!properties) {
      return;
    }
    const propertyName = getPropertyName(namespace);
    const values = minDash.without(properties.get(propertyName), property);
    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: properties,
        properties: {
          [propertyName]: values
        }
      }
    });

    // remove camunda:Properties if there are no properties anymore
    if (!values.length) {
      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: extensionElements,
          properties: {
            values: minDash.without(extensionElements.get('values'), properties)
          }
        }
      });
    }
    commandStack.execute('properties-panel.multi-command-executor', commands);
  };
}

function addFactory$6({
  bpmnFactory,
  commandStack,
  element,
  namespace
}) {
  return function (event) {
    event.stopPropagation();
    let commands = [];
    const businessObject = getRelevantBusinessObject(element);
    let extensionElements = businessObject.get('extensionElements');

    // (1) ensure extension elements
    if (!extensionElements) {
      extensionElements = createElement('bpmn:ExtensionElements', {
        values: []
      }, businessObject, bpmnFactory);
      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: businessObject,
          properties: {
            extensionElements
          }
        }
      });
    }
    const propertyName = getPropertyName(namespace);

    // (2) ensure camunda:Properties
    let properties = getProperties(businessObject, namespace);
    if (!properties) {
      const parent = extensionElements;
      properties = createElement(`${namespace}:Properties`, {
        [propertyName]: []
      }, parent, bpmnFactory);
      commands.push({
        cmd: 'element.updateModdleProperties',
        context: {
          element,
          moddleElement: extensionElements,
          properties: {
            values: [...extensionElements.get('values'), properties]
          }
        }
      });
    }

    // (3) create camunda:Property
    const property = createElement(`${namespace}:Property`, {}, properties, bpmnFactory);

    // (4) add property to list
    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: properties,
        properties: {
          [propertyName]: [...properties.get(propertyName), property]
        }
      }
    });

    // (5) commit all updates
    commandStack.execute('properties-panel.multi-command-executor', commands);
  };
}


function getRelevantBusinessObject(element) {
  let businessObject = ModelUtil.getBusinessObject(element);
  if (ModelUtil.is(element, 'bpmn:Participant')) {
    return businessObject.get('processRef');
  }
  return businessObject;
}
function getPropertyName(namespace = 'camunda') {
  if (namespace === 'zeebe') {
    return 'properties';
  }
  return 'values';
}
function getProperties(element, namespace = 'camunda') {
  const businessObject = getRelevantBusinessObject(element);
  return getExtensionElementsList(businessObject, `${namespace}:Properties`)[0];
}
function getPropertiesList(element, namespace = 'camunda') {
  const businessObject = getRelevantBusinessObject(element);
  const properties = getProperties(businessObject, namespace);
  return properties && properties.get(getPropertyName(namespace));
}

function getExtensionElementsList(businessObject, type = undefined) {
  const extensionElements = businessObject.get('extensionElements');
  if (!extensionElements) {
    return [];
  }
  const values = extensionElements.get('values');
  if (!values || !values.length) {
    return [];
  }
  if (type) {
    return values.filter(value => ModelUtil.is(value, type));
  }
  return values;
}

