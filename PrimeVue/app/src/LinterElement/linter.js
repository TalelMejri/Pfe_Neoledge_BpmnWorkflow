import $ from 'jquery';

const colorImageSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-octagon">
    <polygon points="6 2 18 2 22 6 22 18 18 22 6 22 2 18 2 6 6 2"></polygon>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12" y2="16"></line>
</svg>

`;
const CorrectIcon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="feather feather-check-circle">
  <circle cx="12" cy="12" r="10"></circle>
  <path d="M9 12l2 2 4-4"></path>
</svg>

`;
import { ErrorModel } from "../Models/Error.js";
import { addError, removeError, getErrorById, removeAllErrors } from "./util"
import { ELEMENT_CHANGED_EVENT, PLAY_SIMULATION_EVENT } from 'bpmn-js-token-simulation/lib/util/EventHelper';

export default function Linter(eventBus, overlays, popupMenu, contextPad, canvas) {

  function createIcon(element) {
    var $overlay = $(colorImageSvg);
    $overlay.click(function (e) {
      alert(getErrorById(element.id).message);
    });
    overlays.add(element, 'icons', {
      position: {
        bottom: 10,
        right: 10
      },
      html: $overlay
    });
  }

  function createIconCorrect(element) {
    var $overlay = $(CorrectIcon);
    $overlay.click(function (e) {
      console.log("error");
    });

    overlays.add(element, 'icons', {
      position: {
        bottom: 10,
        right: 10
      },
      html: $overlay
    });

  }

  eventBus.on(ELEMENT_CHANGED_EVENT, function (event) {
    var element = event.element;
    if (element.labelTarget ||
      !element.businessObject.$instanceOf('bpmn:FlowNode')) {
      return;
    }
    if (element.businessObject.
      $attrs.status == 0) {
      createIcon(element);
    } else {
      createIconCorrect(element);
    }
  });
  eventBus.on(['shape.changed', 'shape.added'], function (event) {
    var element = event.element;
    if (element.labelTarget ||
      !element.businessObject.$instanceOf('bpmn:FlowNode')) {
      return;
    }
    defer(function () {
      if (element.businessObject.$instanceOf('bpmn:StartEvent')) {
        if (element.businessObject.name == null || element.businessObject.name == "") {
          addError(new ErrorModel("Start event must have a name", 0, element.id));
        } else {
          removeError(element.id,"Start event must have a name");
        }
        if (element.businessObject.eventDefinitions) {
          if (element.businessObject.eventDefinitions[0]?.$type == "bpmn:TimerEventDefinition") {
            if (element.businessObject.extensionElements && element.businessObject.extensionElements.get('values').find(e => e.$type === 'neo:TimerCycle')) {
              removeError(element.id,"Start event must have a timer");
              return;
            } else {
              addError(new ErrorModel("Start event must have a timer", 2, element.id));
              createIcon(element);
            }
          } else if (element.businessObject.eventDefinitions[0]?.$type == "bpmn:FileInput") {
            if (element.businessObject.extensionElements && element.businessObject.extensionElements.get('values').find(e => e.$type === 'neo:PathFile')) {
              removeError(element.id,"Start event must have a file input");
              return;
            } else {
              addError(new ErrorModel("Start event must have a file input", 2, element.id));
              createIcon(element);
            }
          }
        } else {
          return
        }
      } else if (element.businessObject.$instanceOf('bpmn:ScriptTask')) {
        if (element.businessObject.name == null || element.businessObject.name == "") {
          console.log("error");
          addError(new ErrorModel("Script task must have a name", 0, element.id));
        } else {
          removeError(element.id,"Script task must have a name");
        }
        if (element.businessObject.extensionElements) {
          if (element.businessObject.extensionElements.values[0]['code'] != "") {
            removeError(element.id,"Script task must have a script");
            return;
          }
        } else {
          addError(new ErrorModel("Script task must have a script", 2, element.id));
          createIcon(element);
        }
      }
    });
  });
}

function defer(fn) {
  setTimeout(fn, 0);
}
