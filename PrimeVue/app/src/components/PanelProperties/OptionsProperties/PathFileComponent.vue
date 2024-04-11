<template>
    <div class="form_properties">
        <InputText v-model="path" type="text" placeholder="Enter Path File"></InputText>
        <Button class="btn" @click="AddPath()">Add</Button>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted, toRaw } from 'vue'
import { GetElement, createElement, AddElement } from "../../../GererElement/utils.ts";
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
            AddElement(element, bpmnElementfactory, 'neo:PathFile', 'path', path.value);
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