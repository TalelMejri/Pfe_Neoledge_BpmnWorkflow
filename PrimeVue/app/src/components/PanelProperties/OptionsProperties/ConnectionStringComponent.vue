<template>
    <div class="form_properties">
        <InputText v-model="conn" type="text" placeholder="Enter Connection String"></InputText>
        <Button class="btn" @click="AddConnection()">Add</Button>
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
        const conn = ref("")
        onMounted(() => {
            GetConn();
        })

        const GetConn = () => {
            conn.value = GetElement(element, 'neo:ConnectionString', 'ConnectionString')
        }

        const AddConnection = () => {
            AddElement(element, bpmnElementfactory, 'neo:ConnectionString', 'ConnectionString', conn.value);
            emit("RefreshDiagram");
        }

        return {
            element,
            bpmnElementfactory,
            conn,
            AddConnection,
            GetConn
        }
    }
})
</script>

<style>
.form_properties{
    margin: 15px;
}
</style>