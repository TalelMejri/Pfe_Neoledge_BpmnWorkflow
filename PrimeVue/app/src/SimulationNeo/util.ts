import {
    domify,
    classes as domClasses,
    event as domEvent,
    query as domQuery
} from 'min-dom';

// @ts-ignore
import { TOGGLE_MODE_EVENT } from "bpmn-js-token-simulation/lib/util/EventHelper.js"

export function toggleMode(active: any, eventBus: any, canvas: any, selection: any, contextPad: any) {
    eventBus.fire(TOGGLE_MODE_EVENT, { active });
    if (active) {
        domClasses(canvas.getContainer().parentNode).add('simulation');
    } else {
        domClasses(canvas.getContainer().parentNode).remove('simulation');
    }
}