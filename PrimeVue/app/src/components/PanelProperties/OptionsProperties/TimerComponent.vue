<template>
    <div class="form_properties">
        <InputText class="input" type="number" placeholder="Enter Timer" v-model="time" />
        <Button class="btn" @click="AddTimer()">Add</Button>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'
import { GetElement, AddElement } from "../../../GererElement/utils.ts";
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
            AddElement(element, bpmnElementfactory, 'neo:TimerCycle', 'time', time.value);
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