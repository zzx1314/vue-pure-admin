<template>
  <div id="bpmnPreview">
    <div :style="{position: 'absolute', left: x.value, top: y.value }" class="tipTop" v-if="isShowTip.value">
      <div class="tip">
        <span>id: {{msg}}</span>
      </div>
      <div class="jou"></div>
    </div>
    <div id="diagram" ref="diagram"></div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: "BpmnPreview",
  setup() {
    const bpmnXmlStr = ref(`<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:flowable="http://flowable.org/bpmn" id="diagram_Process_1679360820194" targetNamespace="http://flowable.org/bpmn"><bpmn2:process id="Process_1679360820194" name="业务流程_1679360820194" isExecutable="true"><bpmn2:startEvent id="Event_0e55n8g"><bpmn2:extensionElements><flowable:formData /></bpmn2:extensionElements><bpmn2:outgoing>Flow_1gtefis</bpmn2:outgoing></bpmn2:startEvent><bpmn2:userTask id="Activity_0yxiznp" name="角色A"><bpmn2:extensionElements><flowable:formData /></bpmn2:extensionElements><bpmn2:incoming>Flow_1gtefis</bpmn2:incoming><bpmn2:outgoing>Flow_11utlsc</bpmn2:outgoing></bpmn2:userTask><bpmn2:sequenceFlow id="Flow_1gtefis" sourceRef="Event_0e55n8g" targetRef="Activity_0yxiznp" /><bpmn2:parallelGateway id="Gateway_1hz8tcd"><bpmn2:incoming>Flow_11utlsc</bpmn2:incoming><bpmn2:outgoing>Flow_1ymlghx</bpmn2:outgoing><bpmn2:outgoing>Flow_1y9cuo7</bpmn2:outgoing></bpmn2:parallelGateway><bpmn2:sequenceFlow id="Flow_11utlsc" sourceRef="Activity_0yxiznp" targetRef="Gateway_1hz8tcd" /><bpmn2:userTask id="Activity_0g1dyjt" name="角色B"><bpmn2:extensionElements><flowable:formData /></bpmn2:extensionElements><bpmn2:incoming>Flow_1ymlghx</bpmn2:incoming><bpmn2:outgoing>Flow_0xd8ivq</bpmn2:outgoing></bpmn2:userTask><bpmn2:sequenceFlow id="Flow_1ymlghx" sourceRef="Gateway_1hz8tcd" targetRef="Activity_0g1dyjt" /><bpmn2:userTask id="Activity_1ityqze" name="角色C"><bpmn2:extensionElements><flowable:formData /></bpmn2:extensionElements><bpmn2:incoming>Flow_1y9cuo7</bpmn2:incoming><bpmn2:outgoing>Flow_0731bc0</bpmn2:outgoing></bpmn2:userTask><bpmn2:sequenceFlow id="Flow_1y9cuo7" sourceRef="Gateway_1hz8tcd" targetRef="Activity_1ityqze" /><bpmn2:exclusiveGateway id="Gateway_1ahzlxv"><bpmn2:incoming>Flow_0731bc0</bpmn2:incoming><bpmn2:incoming>Flow_0ueuum3</bpmn2:incoming><bpmn2:outgoing>Flow_1vgulvu</bpmn2:outgoing><bpmn2:outgoing>Flow_03ixnp1</bpmn2:outgoing></bpmn2:exclusiveGateway><bpmn2:sequenceFlow id="Flow_0xd8ivq" sourceRef="Activity_0g1dyjt" targetRef="Activity_1xcj10i" /><bpmn2:sequenceFlow id="Flow_0731bc0" sourceRef="Activity_1ityqze" targetRef="Gateway_1ahzlxv" /><bpmn2:userTask id="Activity_1t6xlou" name="角色D"><bpmn2:extensionElements><flowable:formData /></bpmn2:extensionElements><bpmn2:incoming>Flow_1vgulvu</bpmn2:incoming><bpmn2:outgoing>Flow_1fiodsk</bpmn2:outgoing></bpmn2:userTask><bpmn2:sequenceFlow id="Flow_1vgulvu" name="业务1" sourceRef="Gateway_1ahzlxv" targetRef="Activity_1t6xlou"><bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression">&gt;10</bpmn2:conditionExpression></bpmn2:sequenceFlow><bpmn2:userTask id="Activity_0l8jgcd" name="角色E"><bpmn2:extensionElements><flowable:formData /></bpmn2:extensionElements><bpmn2:incoming>Flow_03ixnp1</bpmn2:incoming><bpmn2:outgoing>Flow_1xajfi6</bpmn2:outgoing></bpmn2:userTask><bpmn2:sequenceFlow id="Flow_03ixnp1" name="业务2" sourceRef="Gateway_1ahzlxv" targetRef="Activity_0l8jgcd"><bpmn2:conditionExpression xsi:type="bpmn2:tFormalExpression">&lt;10</bpmn2:conditionExpression></bpmn2:sequenceFlow><bpmn2:endEvent id="Event_0fx35u7"><bpmn2:incoming>Flow_1fiodsk</bpmn2:incoming><bpmn2:incoming>Flow_1xajfi6</bpmn2:incoming></bpmn2:endEvent><bpmn2:sequenceFlow id="Flow_1fiodsk" sourceRef="Activity_1t6xlou" targetRef="Event_0fx35u7" /><bpmn2:sequenceFlow id="Flow_1xajfi6" sourceRef="Activity_0l8jgcd" targetRef="Event_0fx35u7" /><bpmn2:userTask id="Activity_1xcj10i" name="角色F"><bpmn2:extensionElements><flowable:formData /></bpmn2:extensionElements><bpmn2:incoming>Flow_0xd8ivq</bpmn2:incoming><bpmn2:outgoing>Flow_0ueuum3</bpmn2:outgoing></bpmn2:userTask><bpmn2:sequenceFlow id="Flow_0ueuum3" sourceRef="Activity_1xcj10i" targetRef="Gateway_1ahzlxv" /></bpmn2:process><bpmndi:BPMNDiagram id="BPMNDiagram_1"><bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1679360820194"><bpmndi:BPMNEdge id="Flow_1xajfi6_di" bpmnElement="Flow_1xajfi6"><di:waypoint x="900" y="310" /><di:waypoint x="900" y="210" /><di:waypoint x="952" y="210" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_1fiodsk_di" bpmnElement="Flow_1fiodsk"><di:waypoint x="910" y="210" /><di:waypoint x="952" y="210" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_03ixnp1_di" bpmnElement="Flow_03ixnp1"><di:waypoint x="695" y="260" /><di:waypoint x="730" y="260" /><di:waypoint x="730" y="350" /><di:waypoint x="810" y="350" /><bpmndi:BPMNLabel><dc:Bounds x="731" y="303" width="29" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_1vgulvu_di" bpmnElement="Flow_1vgulvu"><di:waypoint x="695" y="260" /><di:waypoint x="730" y="260" /><di:waypoint x="730" y="210" /><di:waypoint x="810" y="210" /><bpmndi:BPMNLabel><dc:Bounds x="731" y="223" width="29" height="14" /></bpmndi:BPMNLabel></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_0731bc0_di" bpmnElement="Flow_0731bc0"><di:waypoint x="570" y="330" /><di:waypoint x="670" y="330" /><di:waypoint x="670" y="285" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_0xd8ivq_di" bpmnElement="Flow_0xd8ivq"><di:waypoint x="510" y="170" /><di:waypoint x="540" y="170" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_1y9cuo7_di" bpmnElement="Flow_1y9cuo7"><di:waypoint x="380" y="275" /><di:waypoint x="380" y="330" /><di:waypoint x="470" y="330" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_1ymlghx_di" bpmnElement="Flow_1ymlghx"><di:waypoint x="380" y="225" /><di:waypoint x="380" y="170" /><di:waypoint x="410" y="170" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_11utlsc_di" bpmnElement="Flow_11utlsc"><di:waypoint x="320" y="250" /><di:waypoint x="355" y="250" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_1gtefis_di" bpmnElement="Flow_1gtefis"><di:waypoint x="188" y="250" /><di:waypoint x="220" y="250" /></bpmndi:BPMNEdge><bpmndi:BPMNEdge id="Flow_0ueuum3_di" bpmnElement="Flow_0ueuum3"><di:waypoint x="640" y="170" /><di:waypoint x="670" y="170" /><di:waypoint x="670" y="235" /></bpmndi:BPMNEdge><bpmndi:BPMNShape id="Event_0e55n8g_di" bpmnElement="Event_0e55n8g"><dc:Bounds x="152" y="232" width="36" height="36" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Event_0fx35u7_di" bpmnElement="Event_0fx35u7"><dc:Bounds x="952" y="192" width="36" height="36" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_0l8jgcd_di" bpmnElement="Activity_0l8jgcd"><dc:Bounds x="810" y="310" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_1t6xlou_di" bpmnElement="Activity_1t6xlou"><dc:Bounds x="810" y="170" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_0yxiznp_di" bpmnElement="Activity_0yxiznp"><dc:Bounds x="220" y="210" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Gateway_1hz8tcd_di" bpmnElement="Gateway_1hz8tcd"><dc:Bounds x="355" y="225" width="50" height="50" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_1ityqze_di" bpmnElement="Activity_1ityqze"><dc:Bounds x="470" y="290" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_0g1dyjt_di" bpmnElement="Activity_0g1dyjt"><dc:Bounds x="410" y="130" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Activity_1xcj10i_di" bpmnElement="Activity_1xcj10i"><dc:Bounds x="540" y="130" width="100" height="80" /></bpmndi:BPMNShape><bpmndi:BPMNShape id="Gateway_1ahzlxv_di" bpmnElement="Gateway_1ahzlxv" isMarkerVisible="true"><dc:Bounds x="645" y="235" width="50" height="50" /></bpmndi:BPMNShape></bpmndi:BPMNPlane></bpmndi:BPMNDiagram></bpmn2:definitions>`);
    const historyNodeIds = ref(['Event_0e55n8g', 'Activity_0yxiznp', 'Activity_0g1dyjt', 'Activity_0g1dyjt']);
    const currentNodeIds = ref(['Activity_1xcj10i']);
    const viewer = ref(null);
    const isShowTip = ref(false);
    const x = ref('');
    const y = ref('');
    const msg = ref('');
    const diagram = ref(null);

    const showBpmn = async () => {
      try {
        await viewer.value.importXML(bpmnXmlStr.value);
        const canvas = viewer.value.get('canvas');
        canvas.zoom('fit-viewport');
        const eventBus = viewer.value.get('eventBus');

        eventBus.on('element.click', e => {
          if (e.element.type === 'bpmn:UserTask') {
            isShowTip.value = true;
            x.value = e.element.x + 'px';
            y.value = e.element.y + 'px';
            msg.value = e.element.id;
          } else {
            isShowTip.value = false;
          }
        });

        if (historyNodeIds.value.length > 0) {
          historyNodeIds.value.forEach(item => {
            canvas.addMarker(item, 'endhighlight');
          });
        }
        if (currentNodeIds.value.length > 0) {
          currentNodeIds.value.forEach(one => {
            canvas.addMarker(one, 'highlight');
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    onMounted(() => {
      viewer.value = new BpmnJS({
        container: diagram.value,
        height: 400
      });
      showBpmn();
    });

    return {
      bpmnXmlStr,
      historyNodeIds,
      currentNodeIds,
      viewer,
      isShowTip,
      x,
      y,
      msg,
      diagram,
      showBpmn
    };
  }
};
</script>

<style scoped lang="scss">
.tipTop {
  position: absolute;
  z-index: 10;
  width: 200px;
  height: 100px;
  margin: 0 auto;
  color: black;
  background: #66cccc;
}

.tip {
  margin: 10px;
}

.jou {
  position: absolute;
  bottom: 50px;
  left: -10px;
  width: 0px;
  height: 0px;
  border-top: 6px solid transparent;
  border-left: 6px solid transparent;
  border-right: 6px solid #66cccc;
  border-bottom: 6px solid transparent;
}
</style>
