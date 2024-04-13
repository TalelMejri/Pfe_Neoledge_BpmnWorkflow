<template>
  <div class="home">
    <div>
      <HeaderComponent></HeaderComponent>
      <HeaderComponentConfig @importDiagram="importDiagram" @resetDiagram="resetDiagram"
        @downloadDiagramXml="downloadDiagramXml" @SaveDiagram="SaveDiagram" @downloadDiagramSvg="downloadDiagramSvg"
        @ToggleSimulation="ToggleSimulation" @BackModeling="BackModeling" @editXML="editXML" :xml_viewer="xml_viewer"
        :errors="errors"></HeaderComponentConfig>
      <input type="file" accept=".bpmn" @change="handleFileImport" ref="fileInput" style="display: none" />
    </div>
    <div v-if="xml_viewer" class="xml-editor">
      <div class="numbers">
        <span v-html="numbers_lines()" class="numbers-line"></span>
      </div>
      <pre class="xml-code" contenteditable><code ref="XmlEdit" class="language-xml" v-html="xmlContent"></code></pre>
    </div>
    <div class="flow-container" v-else>
      <div ref="content" class="containers">
        <div id="canvas" ref="canvas" class="canvas"></div>
      </div>
      <div class="OptionConfig" :class="visibleErrors ? 'visible' : ''">
        <Button icon="pi pi-search-plus" v-tooltip.top="{ value: 'Zoom In', showDelay: 100, hideDelay: 100 }"
          @click="zoomIn" />
        <Button icon="pi pi-search-minus" v-tooltip.top="{ value: 'Zoom out', showDelay: 100, hideDelay: 100 }"
          @click="zoomOut" />
        <Button icon="pi pi-bars" v-tooltip.top="{ value: 'Keyboard Shortcuts', showDelay: 100, hideDelay: 100 }"
          @click="visible = true" />
      </div>
      <Dialog class="keyboard-shortcuts" v-model:visible="visible" modal header="keyboard-shortcuts"
        :style="{ width: '25rem' }">
        <ul>
          <li v-for="shortcut in keyboardShortcuts" :key="shortcut.key">
            <span>{{ shortcut.description }}</span> <span class="shortcut-keys">{{ shortcut.key }}</span>
          </li>
        </ul>
      </Dialog>
      <div class="card_error" :class="!visibleErrors ? 'visible' : ''">
        <div class="header_error" @click="visibleErrors = !visibleErrors">
          <p>
            Problems <Badge :value="problems.length" severity="danger"></Badge>
          </p>
        </div>
        <div class="error_body">
          <div>
            <ul v-if="problems.length == 0">
              <li class="errors_empty">
                <span class="icon check">
                  <i class="pi pi-check-circle"></i>
                </span>
                <span>No problems found. You can start executing your diagram now</span>
              </li>
            </ul>
            <ul>
              <li v-for="err in problems" :key="err.id">
                <span :class="['icon', { 'info': err.code === 0, 'warning': err.code === 1, 'error': err.code === 2 }]">
                  <i v-if="err.code === 0" class="pi pi-info-circle"></i>
                  <i v-else-if="err.code === 1" class="pi pi-exclamation-triangle"></i>
                  <i v-else class="pi pi-times-circle"></i>
                </span>
                <span>{{ err.idElement }}: {{ err.message }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Sidebar class="panel" v-model:visible="visibleRight" header="Neoledge Panel" position="right">
        <MainPanelComponent @RefreshDiagram="RefreshDiagram" @updateActivityName="updateActivityName" :element="element"
          @updateProperty="updateProperty" :bpmnElementfactory="bpmnElementfactory"
          @DeleteProperties="DeleteProperties"></MainPanelComponent>
      </Sidebar>
    </div>
  </div>
</template>

<script setup>
import {
  openLocalDiagram,
  saveDiagram,
  saveDiagramToLocal,
  SaveSvg,
  ResetDiagramLocal,
  parseBPMNJson,
} from "../Utils/diagram_util.ts";
import HeaderComponent from "../components/Headers/HeaderGenralComponent.vue"
import HeaderComponentConfig from "../components/Headers/HeaderConfigBpmn.vue"
import MainPanelComponent from "../components/PanelProperties/MainPanelComponent"
import TokenSimulationModule from 'bpmn-js-token-simulation/lib/modeler.js';
import { toggleMode } from "../SimulationNeo/util.ts"
import WorkfloService from "../service/WorkfloService.ts"
import { DeleteElement, UpdateElement, checkElementStart } from "../GererElement/utils.ts";
import { ref, onMounted, toRaw, onBeforeMount } from 'vue';
import ColorsBpm from "../colors/index";
import Modeler from "../Modeler/CustomBpmnModeler";
import gridModule from 'diagram-js-grid';
import NeoledgeDescriptor from '../descriptor/NeoledgeDescriptor.json';
import LinterModule from "../LinterElement/index.ts";
import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
hljs.registerLanguage('xml', xml);
import {
  GetAllErrors,
  GetAllProblems
} from "../LinterElement/GererError.ts";
const errors = ref(GetAllErrors());
const problems = ref(GetAllProblems());
let modeler;
const canvas = ref(null);
const element = ref(null);
const _active = ref(true);
const visibleRight = ref(false);
const visibleErrors = ref(false);
const fileInput = ref(null);
let zoomLevel = ref(1);
const xmlContent = ref("")
let bpmnElementRegistry;
let bpmnElementfactory;
let xml_viewer = ref(false);
const XmlEdit = ref("XmlEdit");
const visible = ref(false);

const keyboardShortcuts = [
  { key: 'Ctrl + Z', description: 'Undo' },
  { key: 'Ctrl + ⇧ + Z', description: 'Redo' },
  { key: 'Ctrl + A', description: 'Select All' },
  { key: 'H', description: 'Hand Tool' },
  { key: 'E', description: 'Direct Editing' },
  { key: 'L', description: 'Lasso Tool' },
  { key: '⇧ + M', description: 'Create Milestone' },
  { key: 'Ctrl + Scrolling', description: 'Scrolling (Vertical)' },
  { key: 'Ctrl + ⇧ + Scrolling', description: 'Scrolling (Horizontal)' },
  { key: 'A', description: 'Attention Grabber' },
  { key: 'S', description: 'Space Tool' },
  { key: 'Ctrl + F', description: 'Search BPMN Symbol' }
];

onMounted(() => {
  initializeModeler();
});

onBeforeMount(() => {
  initializeModeler();
});

const editXML = () => {
  modeler.saveXML({ format: true }, function (err, updatedXml) {
    if (err) {
      console.error(err);
      return;
    }
    xmlContent.value = hljs.highlight(
      updatedXml,
      { language: 'xml' }
    ).value;
  });

  xml_viewer.value = true;
}

const BackModeling = () => {
  xml_viewer.value = false;
  UpdateModelingXml();
}
const zoomIn = () => {
  if (zoomLevel.value < 3) {
    zoomLevel.value += 0.1;
    modeler.get('canvas').zoom(zoomLevel.value);
  }
};
const zoomOut = () => {
  if (zoomLevel.value > 0.2) {
    zoomLevel.value -= 0.1;
    modeler.get('canvas').zoom(zoomLevel.value);
  }
};
const numbers_lines = () => {
  let lines = xmlContent.value.split("\n").length;
  let numbers = "";
  for (let i = 1; i <= lines; i++) {
    numbers += i + "\n";
  }
  return numbers;
}

const UpdateModelingXml = () => {
  const xmlContentNew = XmlEdit.value.textContent;
  if (modeler) {
    modeler.destroy();
  }
  modeler.importXML(xmlContent.value.textContent, function (err) {
    modeler = new Modeler({
      container: canvas.value,
      keyboard: { bindTo: window },
      additionalModules: [
        gridModule,
        ColorsBpm,
        LinterModule,
        TokenSimulationModule
      ],
      moddleExtensions: { neo: NeoledgeDescriptor }
    });

    bpmnElementRegistry = modeler.get('elementRegistry');
    bpmnElementfactory = modeler.get('bpmnFactory');

    bindModelerEvents();
    fixDuplicateIds(modeler)
    openLocalDiagram(modeler, xmlContentNew);
  });
}

const fixDuplicateIds = (modeler) => {
  const elementRegistry = modeler.get('elementRegistry');
  const elements = elementRegistry.getAll();
  const idMap = new Map();
  elements.forEach(element => {
    const id = element.id;
    const type = element.type;
    if (idMap.has(id)) {
      let count = idMap.get(id);
      count++;
      const newId = id + "_" + count;
      idMap.set(id, count);
      modeler.get('modeling').updateProperties(element, { id: newId });
    } else {
      idMap.set(id, 1);
    }
  });
};

const initializeModeler = () => {
  modeler = new Modeler({
    container: canvas.value,
    keyboard: { bindTo: window },
    additionalModules: [
      gridModule,
      ColorsBpm,
      TokenSimulationModule,
      LinterModule,
    ],
    moddleExtensions: { neo: NeoledgeDescriptor }
  });
  bpmnElementRegistry = modeler.get('elementRegistry');
  bpmnElementfactory = modeler.get('bpmnFactory');

  bindModelerEvents();
  openLocalDiagram(modeler);
};

const bindModelerEvents = () => {
  modeler.on('selection.changed', handleSelectionChange);
  modeler.on('element.click', handleElementChange);
};

const updateActivityName = newName => {
  if (element && element.value) {
    const elementNew = bpmnElementRegistry.get(element.value[3]["id"]);
    modeler.get('modeling').updateProperties(elementNew, { name: newName });
  } else {
    console.log('null');
  }
};

const DeleteProperties = (properties) => {
  DeleteElement(
    element,
    'neo:Properties',
    bpmnElementfactory,
    "properties",
    properties,
    'neo:Property',
    "name"
  );
};

const updateProperty = (newName, NewValue, name, value) => {
  UpdateElement(
    element,
    'neo:Properties',
    "properties",
    "name",
    name,
    value,
    newName,
    NewValue
  );
}

const handleSelectionChange = (event) => {
  const selectedElement = event.newSelection[0];
  if (selectedElement !== undefined) {
    // const eventBus = modeler.get('eventBus');
    // eventBus.fire('tokenSimulation.simulator.elementChanged', { true: true });
    checkElementStart([selectedElement.id, selectedElement.labels, selectedElement.type, selectedElement.businessObject]);
    element.value = [selectedElement.id, selectedElement.labels, selectedElement.type, selectedElement.businessObject];
    CheckStatus(element.value);
    visibleRight.value = true;
  } else {
    element.value = null;
    visibleRight.value = false;
  }
};

const RefreshDiagram = () => {
  modeler.saveXML({ format: true }, function (err, updatedXml) {
    if (err) {
      console.error(err);
      return;
    }
    modeler.importXML(updatedXml, function (err) {
      if (err) {
        console.error(err);
      }
    });
  });
}


const CheckStatus = (element) => {
  if (element[3]["status"] == undefined) {
    const elementNew = bpmnElementRegistry.get(element[3]["id"]);
    modeler.get('modeling').updateProperties(elementNew, { status: 0 });
  } else {
    console.log('null');
  }
}

const handleElementChange = (event) => {
  const changedElement = event.element;
  if (changedElement !== undefined) {
    checkElementStart([changedElement.id, changedElement.labels, changedElement.type, changedElement.businessObject]);
    element.value = [changedElement.id, changedElement.labels, changedElement.type, changedElement.businessObject];
  } else {
    element.value = null;
  }
};

const importDiagram = () => {
  fileInput.value.click();
}

const handleFileImport = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    if (modeler) {
      modeler.destroy();
    }
    modeler = new Modeler({
      container: canvas.value,
      keyboard: { bindTo: window },
      additionalModules: [
        gridModule,
        ColorsBpm,
        LinterModule,
        TokenSimulationModule
      ],
      moddleExtensions: { neo: NeoledgeDescriptor }
    });


    bpmnElementRegistry = modeler.get('elementRegistry');
    bpmnElementfactory = modeler.get('bpmnFactory');

    bindModelerEvents();
    openLocalDiagram(modeler, e.target.result);

    ResetDiagramLocal();
  };
  reader.readAsBinaryString(file);
};

const resetDiagram = () => {
  modeler.destroy();
  ResetDiagramLocal();
  initializeModeler();
};

const downloadDiagramXml = () => {
  saveDiagram(toRaw(modeler))
};
function SaveDiagram() {
  saveDiagramToLocal(modeler);
}
const downloadDiagramSvg = async () => {
  SaveSvg(modeler);
};
const ToggleSimulation = () => {
  if (errors.value.length > 0) {
    alert("There are errors in the process. Please fix them before starting the simulation.")
    return;
  } else {
    modeler.saveXML({ format: true }, function (err, updatedXml) {
      if (err) {
        console.error(err);
        return;
      }
      const blob = new Blob([updatedXml], { type: 'application/bpmn20-xml;charset=utf-8' });
      var definitions = modeler.get("canvas").getRootElement().businessObject.$parent;
      WorkfloService.UploadFile(blob, parseBPMNJson(definitions)).then((res) => {
        if (res.data.length == 0) {
          return;
        } else {
          for (let i = 0; i < (res.data).length; i++) {
            const elementNew = bpmnElementRegistry.get(res.data[i]);
            modeler.get('modeling').updateProperties(elementNew, { status: 1 });
          }
          const eventBus = modeler.get('eventBus');
          const active = _active.value;
          _active.value = !active;
          const canvas = modeler.get('canvas');
          const selection = modeler.get('selection');
          const contextPad = modeler.get('contextPad');
          toggleMode(active, eventBus, canvas, selection, contextPad);
        }
      })
    });
  }
}


</script>
<style lang="scss">
@import '~bpmn-js/dist/assets/diagram-js.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
@import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
@import 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css';
@import url("~bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css");

.bts-toggle-mode {
  display: none !important;
}

.language-xml {
  color: #c678dd;
  font-size: 15px;
  font-weight: bold;
}

.language-xml .hljs-meta {
  color: #61afef;
  font-weight: normal;
}

.language-xml .hljs-attr {
  color: #e06c75;
  font-weight: bold;
}

.language-xml .hljs-string {
  color: #98c379;
  font-weight: normal;
}

.error_body {
  font-family: Arial, sans-serif;
  overflow-y: scroll;
  height: 90px;
  position: relative;
  padding: 12px 0px 12px 0px;

  .errors_empty {
    text-align: center;
    padding-top: 18px;

    span {
      font-size: 15px !important;
      font-weight: 500;
    }
  }
}

.error_body::-webkit-scrollbar {
  width: 12px;
}

.error_body::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.error_body::-webkit-scrollbar-thumb {
  background: #0a6e89;
  border-radius: 6px;
}

.error_body::-webkit-scrollbar-thumb:hover {
  background: #0a6e89;
}

.header_error {
  text-align: center;

  p {
    font-size: 15px;
    display: flex;
    justify-content: center;
    gap: 5px;
    align-items: center;
    font-weight: bold;
    padding-bottom: 1px;
  }

  border-bottom: 1px solid #f0f0f0;
}

.card_error {
  position: absolute;
  left: 0;
  cursor: pointer;
  bottom: 2%;
  width: 100%;
  height: 120px;
  padding: 5px;
  border: 1px solid #f0f0f0;
  background-color: white;
  transition: bottom 0.5s;
}

.card_error.visible {
  bottom: 0;
  height: 33px;

  .error_body {
    overflow: hidden;
    height: 0px;
    padding: 0px;
  }
}

.error_body ul {
  list-style: none;
  padding: 0;
}

.error_body li {
  margin-bottom: 10px;
}

.error_body .icon {
  margin-right: 10px;
}

.error_body .info {
  color: #007bff;
}

.error_body .warning {
  color: #ffc107;
}

.error_body .check {
  color: green;
}

.error_body .error {
  color: #dc3545;
}

.bts-toggle {
  display: none !important;
}

.djs-popup.color-picker .djs-popup-body .entry {
  margin: 2px;
}

.djs-popup.color-picker .djs-popup-body {
  display: grid;
  grid: auto-flow / 1fr 1fr 1fr;
}

.containers {
  background-color: #ffffff;
  width: 100%;
  height: 77vh;
}

.canvas {
  width: 100%;
  height: 100%;
}

.bjs-powered-by {
  display: none;
}

img {
  width: 50px;
}

.panel {
  padding: 1em;
}

.p-button {
  background-color: #0a6e89 !important
}

.xml-editor {
  width: 100%;
  border: 1px solid #ccc;
  display: flex;
  background-color: whitesmoke;
  overflow-y: scroll;
  max-height: 550px;
  height: 550px;
  padding: 15px;
}

.xml-editor::-webkit-scrollbar {
  width: 12px;
  height: 10px;
  cursor: pointer;
}

.xml-editor::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.xml-editor::-webkit-scrollbar-thumb {
  background: #0a6e89;
  border-radius: 6px;
}

.xml-editor::-webkit-scrollbar-thumb:hover {
  background: #0a6e89;
}

.xml-code {
  margin-left: 12px !important;

}

.numbers {
  white-space: pre-line;
  font-size: 14px;
  padding-top: 1.5px;
  color: gray;

}

.numbers-line {
  display: block;
  line-height: 16.6px;
}

.OptionConfig {
  position: absolute;
  right: 15px;
  bottom: 35px;
  display: flex;
  background-color: whitesmoke;
  gap: 15px;
  padding: 12px 15px;
  transition: bottom 0.5s;
  border-radius: 2px;
}

.OptionConfig.visible {
  bottom: 135px;
}

.keyboard-shortcuts {
  padding: 15px 20px;
  ul {
    padding-top: 15px;
    padding-left: 9px;
    li {
      list-style-type: none;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>