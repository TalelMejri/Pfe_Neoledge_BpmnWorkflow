// @ts-ignore
import $ from 'jquery';
// @ts-ignore
import { BpmnEvent } from '../bpmn-js/lib/core';
// @ts-ignore
import { ELEMENT_CHANGED_EVENT } from 'bpmn-js-token-simulation/lib/util/EventHelper';
import { getErrorById, GetAllErrors } from "./GererError"
import { ErrorBpmn } from "./BpmnRules";
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


export default function Linter(eventBus: any, overlays: any, popupMenu: any, contextPad: any, canvas: any) {

  function createIcon(element: any) {
    var $overlay = $(colorImageSvg);
    $overlay.click(function (e: any) {
      alert(getErrorById(element.id)?.message);
    });
    overlays.add(element, 'icons', {
      position: {
        bottom: 10,
        right: 10
      },
      html: $overlay
    });
  }

  function createIconCorrect(element: any) {
    var $overlay = $(CorrectIcon);
    $overlay.click(function (e: any) {
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

  eventBus.on(ELEMENT_CHANGED_EVENT, function (event: BpmnEvent) {
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
  eventBus.on(['shape.changed', 'shape.added'], function (event: BpmnEvent) {
    var element = event.element;
    if (element.labelTarget ||
      !element.businessObject.$instanceOf('bpmn:FlowNode')) {
      return;
    }
    defer(function () {
      ErrorBpmn(element);
      const errors = GetAllErrors();
      if (errors.findIndex(e => e.idElement === element.id) != -1) {
        createIcon(element);
      }
    });
  });
}

function defer(fn: any) {
  setTimeout(fn, 0);
}
