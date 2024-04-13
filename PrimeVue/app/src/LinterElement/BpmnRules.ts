import { ErrorModel } from "../Models/Error";
import { addError, removeError } from "./GererError";

function validateStartEvent(element:any) {
    if (element.businessObject.eventDefinitions) {
        const eventType = element.businessObject.eventDefinitions[0]?.$type;
        if (eventType === "bpmn:TimerEventDefinition") {
            const hasTimer = element.businessObject.extensionElements?.get('values')?.find((e:any) => e.$type === 'neo:TimerCycle');
            if (hasTimer) {
                removeError(element.id, "Start event must have a timer");
                return;
            }
            addError(new ErrorModel("Start event must have a timer", 2, element.id));
        } else if (eventType === "bpmn:FileInput") {
            const hasFileInput = element.businessObject.extensionElements?.get('values')?.find((e:any) => e.$type === 'neo:PathFile');
            if (hasFileInput) {
                removeError(element.id, "Start event must have a file input");
                return;
            }
            addError(new ErrorModel("Start event must have a file input", 2, element.id));
        }
    }
}

function validateName(element:any, errorMessage:any) {
    if (element.businessObject.name == null || element.businessObject.name === "") {
        addError(new ErrorModel(errorMessage, 0, element.id));
    } else {
        removeError(element.id, errorMessage);
    }
}

function validateScriptTask(element:any) {
    if (!element.businessObject.extensionElements || !element.businessObject.extensionElements.values[0]['code']) {
        addError(new ErrorModel("Script task must have a script", 2, element.id));
    } else {
        removeError(element.id, "Script task must have a script");
    }
}

export function ErrorBpmn(element:any) {
    if (element.businessObject.$instanceOf('bpmn:StartEvent')) {
        validateName(element, "Start event must have a name");
        validateStartEvent(element);
    } else if (element.businessObject.$instanceOf('bpmn:ScriptTask')) {
        validateName(element, "ScriptTask must have a name");
        validateScriptTask(element);
    } else if(element.businessObject.$instanceOf('bpmn:BusinessRuleTask')) {
        validateName(element, "BusinessRuleTask event must have a name");
    }
}
