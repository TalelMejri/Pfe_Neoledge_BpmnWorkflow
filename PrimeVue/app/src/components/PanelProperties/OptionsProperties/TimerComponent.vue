<template>
    <div class="form_properties">
        <InputText class="input" type="number" placeholder="Enter Timer" v-model="time" />
        <Button class="btn" @click="AddTimer()">Add</Button>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted, toRaw } from 'vue'
import { GetElement, createElement } from "../../../GererElement/utils.ts";
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
        const time = ref(0)

        onMounted(() => {
            GetTimer();
        })

        const GetTimer = () => {
            time.value = GetElement(element, 'neo:TimerCycle', 'time')
        }

        const AddTimer = () => {
            const businessObject = toRaw(element[3]);
            let extensionElements = businessObject.get('extensionElements');
            if (!extensionElements) {
                extensionElements = createElement('bpmn:ExtensionElements', {}, bpmnElementfactory);
                businessObject.set('extensionElements', extensionElements);
            }
            let path_file = extensionElements.get('values').find(e => e.$type === 'neo:PathFile');
            if (path_file) {
                extensionElements.get('values').splice(extensionElements.get('values').indexOf(path_file), 1);
            }
            let timerCycle = extensionElements.get('values').find(e => e.$type === 'neo:TimerCycle');
            if (!timerCycle) {
                timerCycle = createElement('neo:TimerCycle', { time: time.value }, bpmnElementfactory);
                extensionElements.get('values').push(timerCycle);
            } else {
                timerCycle.time = time.value;
            }
            emit("RefreshDiagram");
        }

        return {
            element,
            bpmnElementfactory,
            time,
            AddTimer,
            GetTimer
        }
    }
})
</script>