/* eslint-disable react/prop-types */
import { TextFieldEntry, SelectEntry, isTextFieldEntryEdited, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';
import * as ModelUtil from 'bpmn-js/lib/util/ModelUtil'
// import * as minDash from 'min-dash'
import { createElement, getElements, isInput, nextId } from '../utils';

export default function InputProps({
  element,
  injector
}) {
  if (!areInputParametersSupported(element)) {
    return null;
  }
  const inputParameters = getInputParameters(element) || [];
  const bpmnFactory = injector.get('bpmnFactory'),
    commandStack = injector.get('commandStack');
  const items = inputParameters.map((parameter, index) => {
    const id = element.id + '-inputParameter-' + index;
    return {
      id,
      label: parameter.get('name') || '',
      entries: InputOutputParameter({
        idPrefix: id,
        element,
        parameter
      }),
      autoFocusEntry: id + '-name'
    };
  });
  function add(event) {
    event.stopPropagation();
    commandStack.execute('properties-panel.multi-command-executor', AddParameterCmd(element, 'camunda:InputParameter', bpmnFactory));
  }
  return {
    items,
    add,
    shouldSort: false
  };
}


function InputOutputParameter(props) {
  const {
    idPrefix,
    parameter
  } = props;
  let entries = [{
    id: idPrefix + '-name',
    component: Name$2,
    isEdited: isTextFieldEntryEdited,
    idPrefix,
    parameter
  }, {
    id: idPrefix + '-type',
    component: Type$2,
    isEdited: isSelectEntryEdited,
    idPrefix,
    parameter
  }];

  return entries;
}


function Name$2(props) {
  const {
    idPrefix,
    element,
    parameter
  } = props;
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const debounce = useService('debounceInput');
  const setValue = value => {
    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: parameter,
      properties: {
        name: value
      }
    });
  };
  const getValue = parameter => {
    return parameter.get('name');
  };
  return TextFieldEntry({
    element: parameter,
    id: idPrefix + '-name',
    label: translate(isInput(parameter) ? 'Local variable name' : 'Process variable name'),
    getValue,
    setValue,
    debounce
  });
}

const DEFAULT_PROPS$3 = {
  value: undefined,
  object: undefined
};

function Type$2(props) {
  const {
    idPrefix,
    element,
    parameter
  } = props;
  const bpmnFactory = useService('bpmnFactory');
  const commandStack = useService('commandStack');
  const translate = useService('translate');
  const createDefinitionElement = type => {
    return createElement(type, {}, parameter, bpmnFactory);
  };
  const getValue = mapping => {
    return getInputOutputType(mapping);
  };
  const setValue = value => {
    let properties = {
      ...DEFAULT_PROPS$3
    };
    // if (value === 'script') {
    //   properties.definition = createDefinitionElement('camunda:Script');
    // } else if (value === 'list') {
    //   properties.definition = createDefinitionElement('camunda:List');
    // } else if (value === 'map') {
    //   properties.definition = createDefinitionElement('camunda:Map');
    // }

    properties.definition = createDefinitionElement('camunda:ObjType');

    commandStack.execute('element.updateModdleProperties', {
      element,
      moddleElement: parameter,
      properties
    });
  };
  const getOptions = () => {
    const options = [{
      label: translate('List'),
      value: 'list'
    }, {
      label: translate('Map'),
      value: 'map'
    }, {
      label: translate('Script'),
      value: 'script'
    }, {
      label: translate('String or expression'),
      value: 'stringOrExpression'
    }];
    return options;
  };
  return SelectEntry({
    element: parameter,
    id: idPrefix + '-type',
    label: translate('Assignment type'),
    getValue,
    setValue,
    getOptions
  });
}

function AddParameterCmd(element, type, bpmnFactory) {
  const commands = [];
  const businessObject = ModelUtil.getBusinessObject(element);
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

  // (2) ensure inputOutput
  let inputOutput = getInputOutput(element);
  if (!inputOutput) {
    const parent = extensionElements;
    inputOutput = createElement('camunda:InputOutput', {
      inputParameters: [],
      outputParameters: []
    }, parent, bpmnFactory);
    commands.push({
      cmd: 'element.updateModdleProperties',
      context: {
        element,
        moddleElement: extensionElements,
        properties: {
          values: [...extensionElements.get('values'), inputOutput]
        }
      }
    });
  }

  // (3) create + add parameter
  commands.push(CreateParameterCmd(element, type, inputOutput, bpmnFactory));
  return commands;
}

function CreateParameterCmd(element, type, parent, bpmnFactory) {
  const isInput = type === 'camunda:InputParameter';
  const newParameter = createElement(type, {
    name: nextId(isInput ? 'Input_' : 'Output_')
  }, parent, bpmnFactory);
  const propertyName = isInput ? 'inputParameters' : 'outputParameters';
  return {
    cmd: 'element.updateModdleProperties',
    context: {
      element,
      moddleElement: parent,
      properties: {
        [propertyName]: [...parent.get(propertyName), newParameter]
      }
    }
  };
}

/**
 * Return all input parameters existing in the business object, and
 * an empty array if none exist.
 *
 * @param  {djs.model.Base} element
 *
 * @return {Array} a list of input parameter objects
 */
function getInputParameters(element) {
  return getParameters(element, 'inputParameters');
}

function getParameters(element, prop) {
  const inputOutput = getInputOutput(element);
  return inputOutput && inputOutput.get(prop) || [];
}

function getInputOutput(element) {
  if (ModelUtil.is(element, 'camunda:Connector')) {
    return element.get('inputOutput');
  }
  const businessObject = ModelUtil.getBusinessObject(element);
  return (getElements(businessObject, 'camunda:InputOutput') || [])[0];
}


/**
 * Return all output parameters existing in the business object, and
 * an empty array if none exist.
 *
 * @param  {djs.model.Base} element
 *
 * @return {Array} a list of output parameter objects
 */
// function getOutputParameters(element) {
//   return getParameters(element, 'outputParameters');
// }
function isInputOutputSupported(element) {
  const businessObject = ModelUtil.getBusinessObject(element);
  return ModelUtil.is(businessObject, 'bpmn:FlowNode') && !(ModelUtil.isAny(businessObject, ['bpmn:StartEvent', 'bpmn:BoundaryEvent', 'bpmn:Gateway']) || ModelUtil.is(businessObject, 'bpmn:SubProcess') && businessObject.get('triggeredByEvent'));
}
function areInputParametersSupported(element) {
  return isInputOutputSupported(element);
}
// function areOutputParametersSupported(element) {
//   const businessObject = ModelUtil.getBusinessObject(element);
//   return isInputOutputSupported(element) && !ModelUtil.is(businessObject, 'bpmn:EndEvent') && !businessObject.loopCharacteristics;
// }
function getInputOutputType(parameter) {
  const definitionTypes = {
    'camunda:Map': 'map',
    'camunda:List': 'list',
    'camunda:Script': 'script'
  };
  let type = 'stringOrExpression';
  const definition = parameter.get('definition');
  if (typeof definition !== 'undefined') {
    type = definitionTypes[definition.$type];
  }
  return type;
}