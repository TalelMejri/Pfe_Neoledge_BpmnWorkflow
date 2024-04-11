import { toRaw } from "vue";

export function createElement(type:string, properties:any, bpmnFactory:any) {
    const element = bpmnFactory.create(type, properties);
    return element;
}

export function checkElementStart(element:any) {
    const businessObject = toRaw(element[3]);
    if (businessObject.$instanceOf('bpmn:StartEvent')) {
        if (businessObject.eventDefinitions) {
            if (businessObject.eventDefinitions[0]?.$type == "bpmn:TimerEventDefinition") {
                if (businessObject.extensionElements) {
                    let path_file = businessObject.extensionElements.get('values').find((e:any) => e.$type === 'neo:PathFile');
                    if (path_file) {
                        businessObject.extensionElements.get('values').splice(businessObject.extensionElements.get('values').indexOf(path_file), 1);
                    }
                }
            } else if (businessObject.eventDefinitions[0]?.$type == "bpmn:FileInput") {
                if (businessObject.extensionElements) {
                    let timerCycle = businessObject.extensionElements.get('values').find((e:any) => e.$type === 'neo:TimerCycle');
                    if (timerCycle) {
                        businessObject.extensionElements.get('values').splice(businessObject.extensionElements.get('values').indexOf(timerCycle), 1);
                    }
                }
            }
        }
    }
}

export function GetContentElements(element:any, TypeChild:any, TypeChildOfChild:any, separator:any) {
    var properties:any = [];
    if (element[3]['extensionElements'] != undefined) {
        if (element[3]['extensionElements']['values'] != undefined) {
            let test = element[3]['extensionElements']['values'].find((e:any) => e.$type == TypeChild);
            if (test) {
                let tab = test[TypeChildOfChild];
                if (tab) {
                    tab.forEach((val:any) => {
                        if (separator == 'IdUser') {
                            properties.push({ IdUser: val.IdUser, comment: val.comment })
                        } else if (separator == 'name') {
                            properties.push({ name: val.name, value: val.value })
                        } else if (separator == "source") {
                            properties.push({ name: val.source, value: val.target })
                        } else {
                            properties.push({ key: val.key, value: val.value })
                        }
                    })
                }
            }
        }
    }
    return properties;
}

export function GetElement(element:any, TypeChild:any, separator:any) {
    if (element[3]['extensionElements'] != undefined) {
        if (element[3]['extensionElements']['values'] != undefined) {
            let test = toRaw(element[3]['extensionElements']['values'].find((e:any) => e.$type == TypeChild));
            if (test) {
                if (separator == 'code') {
                    return test['code']
                } else if (separator == 'path') {
                    return test['path']
                } else if (separator == 'task') {
                    return [test['type'], test['retries']]
                } else if (separator == 'ConnectionString') {
                    return test['ConnectionString']
                } else if (separator == 'requete') {
                    return test['requete']
                } else if (separator == 'TypeSgbd') {
                    return test['TypeSgbd']
                } else if (separator == 'time') {
                    return test['time']
                }
            }
        }
    }
}

export function AddElementComposer(
    element:any,
    bpmnFactory:any,
    TypeChild:any,
    TypeChildOfChild:any,
    ValuesChild:any,
    typeName:any,
    name:any, value:any
) {
    const businessObject = toRaw(element[3]);
    let ItemParent = businessObject.get("extensionElements");

    if (!ItemParent) {
        ItemParent = createElement("bpmn:ExtensionElements", {}, bpmnFactory);
        businessObject.set("extensionElements", ItemParent);
    }

    let ChildItem = ItemParent.get('values').find((e:any) => e.$type === TypeChild);

    if (!ChildItem) {
        ChildItem = createElement(TypeChild, {}, bpmnFactory);
        ItemParent.get('values').push(ChildItem);
    }

    if (typeName == 'key') {
        var ChildItemValue = createElement(TypeChildOfChild, {
            key: name, value: value
        }, bpmnFactory);
    } else if (typeName == 'name') {
        var ChildItemValue = createElement(TypeChildOfChild, {
            name: name, value: value
        }, bpmnFactory);
    } else if (typeName == "source") {
        var ChildItemValue = createElement(TypeChildOfChild, {
            source: name, target: value
        }, bpmnFactory);
    } else {
        var ChildItemValue = createElement(TypeChildOfChild, {
            IdUser: name, comment: value
        }, bpmnFactory);
    }

    ChildItem.get(ValuesChild).push(ChildItemValue);
}

export function DeleteElement(
    element:any,
    TypeChild:any,
    bpmnFactory:any,
    valueChild:any,
    properties:any,
    TypeChildOfChild:any,
    typeName:any,
    val:any
) {

    const businessObject = val ? toRaw(element[3]) : toRaw(element.value[3]);

    let extensionElements = businessObject.get('extensionElements');

    var baseElement = extensionElements.get('values').find((e:any) => e.$type === TypeChild);

    if (valueChild == "properties") {
        baseElement.properties = [];
    } else if (valueChild == "values") {
        baseElement.values = [];
    } else if (valueChild == "inputParameters") {
        baseElement.inputParameters = [];
    } else if (valueChild == "outputParameters") {
        baseElement.outputParameters = [];
    } else {
        baseElement.comments = [];
    }

    if (!extensionElements) {
        extensionElements = createElement('bpmn:ExtensionElements', {}, bpmnFactory);
        businessObject.set('extensionElements', extensionElements);
    }

    if (properties.length >= 1) {
        if (!baseElement) {
            baseElement = createElement(TypeChild, {}, bpmnFactory);
            extensionElements.get('values').push(baseElement);
        }
        if (typeName == "key") {
            for (let i = 0; i < properties.length; i++) {
                var baseElementValue = createElement(TypeChildOfChild, {
                    key: properties[i].key, value: properties[i].value
                }, bpmnFactory);
                baseElement.get(valueChild).push(baseElementValue);
            }
        } else if (typeName == "name") {
            for (let i = 0; i < properties.length; i++) {
                var baseElementValue = createElement(TypeChildOfChild, {
                    name: properties[i].name, value: properties[i].value
                }, bpmnFactory);
                baseElement.get(valueChild).push(baseElementValue);
            }
        } else if (typeName == "source") {
            for (let i = 0; i < properties.length; i++) {
                var baseElementValue = createElement(TypeChildOfChild, {
                    source: properties[i].name, target: properties[i].value
                }, bpmnFactory);
                baseElement.get(valueChild).push(baseElementValue);
            }
        } else {
            for (let i = 0; i < properties.length; i++) {
                var baseElementValue = createElement(TypeChildOfChild, {
                    IdUser: properties[i].IdUser, comment: properties[i].comment
                }, bpmnFactory);
                baseElement.get(valueChild).push(baseElementValue);
            }
        }
    }
}

export function UpdateElement(element:any, TypeChild:any, ValuesChild:any, TypeName:any, name:any, value:any, newName:any, newValue:any, val:any) {
    const businessObject = val ? toRaw(element[3]) : toRaw(element.value[3]);
    let extensionElements = businessObject.get('extensionElements');
    let BaseElement = extensionElements.get('values').find((e:any)=> e.$type === TypeChild);

    if (TypeName == "name") {
        var res = BaseElement.get(ValuesChild).find((e:any) => e.name === name && e.value === value);
    } else if (TypeName == "value") {
        var res = BaseElement.get(ValuesChild).find((e:any) => e.key === name && e.value === value);
    } else {
        var res = BaseElement.get(ValuesChild).find((e:any) => e.source === name && e.target === value);
    }

    if (res) {
        if (TypeName == "name") {
            res.name = newName;
            res.value = newValue;
        } else if (TypeName == "key") {
            res.key = newName;
            res.value = newValue;
        } else {
            res.source = newName;
            res.target = newValue;
        }
    } else {
        console.log('Not found');
    }
}
