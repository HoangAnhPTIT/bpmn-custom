import * as ModelUtil from 'bpmn-js/lib/util/ModelUtil'
import Ids from 'ids';
 
export function getElements(businessObject, type, property) {
  const elements = getExtensionElementsList(businessObject, type);
  return !property ? elements : (elements[0] || {})[property] || [];
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

export function createElement(elementType, properties, parent, factory) {
  const element = factory.create(elementType, properties);
  if (parent) {
    element.$parent = parent;
  }
  return element;
}

export function nextId(prefix) {
  const ids = new Ids([32, 32, 1]);
  return ids.nextPrefixed(prefix);
}


// helper /////////////////////

export function isInput(parameter) {
  return ModelUtil.is(parameter, 'camunda:InputParameter');
}
