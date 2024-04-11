<template>
    <div class="form_properties">
        <Textarea v-model="code" rows="5" cols="30" />    
        <Button class="btn" @click="AddCode()">Add</Button>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted, toRaw } from 'vue'
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
        const code = ref("")

        onMounted(() => {
            GetCode();
        })

        const GetCode = () => {
            code.value = GetElement(element, 'neo:PythonCode', 'code')
        }

        const AddCode = () => {
            AddElement(element, bpmnElementfactory, 'neo:PythonCode', 'code', code.value);
            emit("RefreshDiagram");
        }

        return {
            element,
            bpmnElementfactory,
            code,
            AddCode,
            GetCode
        }
    }
})
</script>