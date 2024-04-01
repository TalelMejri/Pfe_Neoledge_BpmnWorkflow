<template>
    <div class="form_properties">
        <InputText class="input" type="number" placeholder="Enter Timer" v-model="time" />
        <Button class="btn" @click="AddTimer()">Add</Button>
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