<template>
    <div class="form_properties">
        <InputText v-model="path" type="text" placeholder="Enter Path File"></InputText>
        <Button class="btn" @click="AddPath()">Add</Button>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted, toRaw } from 'vue'
import { GetElement, createElement } from "../../../GererElement/utils.js";
export default defineComponent({
    props: {
        element: {
            type: Array,
            required: true
        },
        bpmnElementfactory: {
            type: Object,
            required: true
        }
    },
    emits: ["RefreshDiagram"],
    setup(props, { emit }) {
        const element = props.element;
        const bpmnElementfactory = props.bpmnElementfactory;
        const path = ref("")

        onMounted(() => {
            GetPath();
        })

        const GetPath = () => {
            path.value = GetElement(element, 'neo:PathFile', 'path')
        }

        const AddPath = () => {
            const businessObject = toRaw(element[3]);
            let extensionElements = businessObject.get('extensionElements');
            if (!extensionElements) {
                extensionElements = createElement('bpmn:ExtensionElements', {}, bpmnElementfactory);
                businessObject.set('extensionElements', extensionElements);
            }
            let timerCycle = extensionElements.get('values').find(e => e.$type === 'neo:TimerCycle');
            if (timerCycle) {
                extensionElements.get('values').splice(extensionElements.get('values').indexOf(timerCycle), 1);
            }
            let path_file = extensionElements.get('values').find(e => e.$type === 'neo:PathFile');
            if (!path_file) {
                path_file = createElement('neo:PathFile', { path: path.value }, bpmnElementfactory);
                extensionElements.get('values').push(path_file);
            } else {
                path_file.path = path.value;
            }
            emit("RefreshDiagram");
        }

        return {
            element,
            bpmnElementfactory,
            path,
            AddPath,
            GetPath
        }
    }
})
</script>