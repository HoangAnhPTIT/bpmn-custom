export const emptyBpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:sale="http://sale" xmlns:magic="http://magic" id="sample-diagram" targetNamespace="http://bpmn.io/schema/bpmn" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
  <bpmn2:process id="Process_1" isExecutable="false">
    <bpmn2:startEvent id="StartEvent_1">
      <bpmn2:outgoing>Flow_0uxkrd1</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:endEvent id="Event_1fqkpl3">
      <bpmn2:incoming>Flow_1wkapax</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:exclusiveGateway id="Gateway_1galida" spell="ABC &#62; 4">
      <bpmn2:incoming>Flow_0uxkrd1</bpmn2:incoming>
      <bpmn2:outgoing>Flow_1dyb03r</bpmn2:outgoing>
    </bpmn2:exclusiveGateway>
    <bpmn2:sequenceFlow id="Flow_0uxkrd1" sourceRef="StartEvent_1" targetRef="Gateway_1galida" />
    <bpmn2:sequenceFlow id="Flow_1dyb03r" sourceRef="Gateway_1galida" targetRef="Activity_0qkd7yj" />
    <bpmn2:task id="Activity_0qkd7yj" name="123" sale:object_type="LEAD">
      <bpmn2:incoming>Flow_1dyb03r</bpmn2:incoming>
      <bpmn2:outgoing>Flow_1wkapax</bpmn2:outgoing>
    </bpmn2:task>
    <bpmn2:sequenceFlow id="Flow_1wkapax" sourceRef="Activity_0qkd7yj" targetRef="Event_1fqkpl3" />
  </bpmn2:process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
      <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
        <dc:Bounds x="232" y="240" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1fqkpl3_di" bpmnElement="Event_1fqkpl3">
        <dc:Bounds x="742" y="240" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Gateway_1galida_di" bpmnElement="Gateway_1galida" isMarkerVisible="true">
        <dc:Bounds x="455" y="233" width="50" height="50" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Activity_0qkd7yj_di" bpmnElement="Activity_0qkd7yj">
        <dc:Bounds x="570" y="218" width="100" height="80" />
        <bpmndi:BPMNLabel />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0uxkrd1_di" bpmnElement="Flow_0uxkrd1">
        <di:waypoint x="268" y="258" />
        <di:waypoint x="455" y="258" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1dyb03r_di" bpmnElement="Flow_1dyb03r">
        <di:waypoint x="505" y="258" />
        <di:waypoint x="570" y="258" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1wkapax_di" bpmnElement="Flow_1wkapax">
        <di:waypoint x="670" y="258" />
        <di:waypoint x="742" y="258" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>
`;
