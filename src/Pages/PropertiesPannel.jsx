import { useEffect, useRef } from 'react'

import BpmnJS from "bpmn-js/lib/Modeler";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css"

import "bpmn-js-properties-panel/dist/assets/properties-panel.css";
import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';
// use Camunda BPMN Moddle extension
// import CamundaExtensionModule from 'camunda-bpmn-moddle';

// use Camunda BPMN namespace

import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json';

import magicModdleDescriptor from '../descriptors/magic.json'

import { emptyBpmn } from '../assets/empty.bpmn';
import newPropertiesProvider from '../provider/objectType/index';

export default function PropertiesPannel() {
  const modeler = useRef()
  useEffect(() => {
    const bpmnJS = new BpmnJS({
      container: document.getElementById("bpmn-viewer"),
      keyboard: {
        bindTo: document
      },
      propertiesPanel: {
        parent: document.getElementById("properties-pannel")
      },
      additionalModules: [
        BpmnPropertiesPanelModule,
        BpmnPropertiesProviderModule,
        // newPropertiesProvider
        CamundaPlatformPropertiesProviderModule,
        // CamundaExtensionModule
      ],
      moddleExtensions: {
        // sale: magicModdleDescriptor
        camunda: camundaModdle
      }
    });

    modeler.current = bpmnJS

    bpmnJS.importXML(emptyBpmn)

    console.log(bpmnJS.get('eventBus'))

    bpmnJS.on('element.click', (e) => {
      console.log('e', e)
    })

    const propertiesPanel = bpmnJS.get('propertiesPanel');
    console.log(propertiesPanel)
  }, [])

  function saveDiagram() {
    const handler = async () => {
      const outXml = await modeler.current.saveXML({ format: true });
      console.log(outXml)
      console.log(JSON.stringify(outXml))
    }

    handler()
  }

  return (
    <div>
      <div className='container'>
        <div id="bpmn-viewer"></div>
        <div id="properties-pannel"></div>
      </div>
      <button id="save-button" onClick={saveDiagram}>print to console</button>

    </div>
  )
}
