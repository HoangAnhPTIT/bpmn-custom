import { html } from 'htm/preact';

import {TaskListenerProps, ListGroup} from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';


export default function TaskListenerGroup(element, id) {
  const injector = useService('injector');
  const translate = useService('translate');
  const group = {

    label: translate('Task listeners'),
    id: 'CamundaPlatform__TaskListener',
    component: ListGroup,
    ...TaskListenerProps({
      element,
      injector
    })
  };
  if (group.items) {
    return group;
  }
  return null;
}