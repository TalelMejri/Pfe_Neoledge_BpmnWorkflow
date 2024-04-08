<template>
  <div class="home">
    <div>
      <HeaderComponent></HeaderComponent>
      <HeaderComponentConfig @importDiagram="importDiagram" @resetDiagram="resetDiagram"
        @downloadDiagramXml="downloadDiagramXml" @SaveDiagram="SaveDiagram" @downloadDiagramSvg="downloadDiagramSvg"
        @ToggleSimulation="ToggleSimulation" :errors="errors"></HeaderComponentConfig>
      <input type="file" accept=".bpmn" @change="handleFileImport" ref="fileInput" style="display: none" />
    </div>
    <div class="flow-container">
      <div ref="content" class="containers">
        <div id="canvas" ref="canvas" class="canvas"></div>
      </div>
      <div class="card_error" :class="!visibleErrors ? 'visible' : ''">
        <div class="header_error">
          Problems ({{ errors.length }}) <Button icon="pi pi-exclamation-triangle" class="mx-2" severity="secondary"
            @click="visibleErrors = !visibleErrors" />
        </div>
        <div class="error_body">
          <div>
            <ul>
              <li v-for="err in errors" :key="err.id">
                <span :class="['icon', { 'info': err.code === 0, 'warning': err.code === 1, 'error': err.code === 2 }]">
                  <i v-if="err.code === 0" class="pi pi-info-circle"></i>
                  <i v-else-if="err.code === 1" class="pi pi-exclamation-triangle"></i>
                  <i v-else class="pi pi-times-circle"></i>
                </span>
                <span>{{ err.id }}: {{ err.message }}</span>
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
} from "../Utils/diagram_util.js"
import HeaderComponent from "../components/Headers/HeaderGenralComponent.vue"
import HeaderComponentConfig from "../components/Headers/HeaderConfigBpmn.vue"
import MainPanelComponent from "../components/PanelProperties/MainPanelComponent"
import TokenSimulationModule from 'bpmn-js-token-simulation/lib/modeler.js';
import { toggleMode } from "../SimulationNeo/util.js"
import WorkfloService from "../service/WorkfloService.js"
import { createElement, AddElementComposer, DeleteElement, UpdateElement, checkElementStart } from "../GererElement/utils.js";
import { ref, onMounted, toRaw, onBeforeMount } from 'vue';
import ColorsBpm from "../colors/index";
import Modeler from "../Modeler/CustomBpmnModeler.js";
import gridModule from 'diagram-js-grid';
import NeoledgeDescriptor from '../descriptor/NeoledgeDescriptor.json';
import LinterModule from "../LinterElement/index.js";
import { functionGetAllErrors } from "../LinterElement/util.ts";
const errors = ref(functionGetAllErrors());
let modeler;
const canvas = ref(null);
const element = ref(null);
const _active = ref(true);
const visibleRight = ref(false);
const visibleErrors = ref(false);
const fileInput = ref(null);
let zoomLevel = ref(1);
let bpmnElementRegistry;
let bpmnElementfactory;

onMounted(() => {
  initializeModeler();
});

onBeforeMount(() => {
  initializeModeler();
});


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
  modeler.on('element.changed', handleElementChange);
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
        LinterModule,
        ColorsBpm,
        TokenSimulationModule
      ],
      moddleExtensions: { neo: NeoledgeDescriptor }
    });

    bpmnElementRegistry = modeler.get('elementRegistry');
    bpmnElementfactory = modeler.get('bpmnFactory');

    bindModelerEvents();
    openLocalDiagram(modeler, e.target.result);
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

.error_body {
  font-family: Arial, sans-serif;
  overflow-y: scroll;
  height: 90px;
  position: relative;
  padding: 12px 0px 12px 0px;
}

.header_error {
  text-align: center;
}

.card_error {
  position: absolute;
  left: 0;
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
  height: 50px;

  .error_body {
    overflow-y: hidden;
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
</style>