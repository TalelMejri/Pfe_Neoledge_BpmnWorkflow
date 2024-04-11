// @ts-ignore
import Modeler from "../bpmn-js/lib/Modeler.js";

// import { START_EVENT } from "bpmn-js/lib/features/replace/ReplaceOptions.js";

// var indexToReplace = START_EVENT.findIndex(event => event.actionName === 'replace-with-conditional-start');

// START_EVENT[indexToReplace] = {
//     label: 'File Input',
//     actionName: 'replace-with-conditional-start',
//     className: 'bpmn-icon-start-event-condition',
//     target: {
//         type: 'bpmn:StartEvent',
//         eventDefinitionType: 'bpmn:FileInput'
//     }
// };

export default Modeler;
// import CustomModule from "../custom";

// Modeler.prototype._modules = [].concat(Modeler.prototype._modules, [
//   CustomModule
// ]);