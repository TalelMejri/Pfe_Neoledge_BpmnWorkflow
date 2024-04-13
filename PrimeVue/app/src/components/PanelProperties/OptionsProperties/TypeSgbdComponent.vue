<template>
    <div class="dropdown_content">
        <Dropdown v-model="type_sgbd" :options="Items" @change="AddTypeSgbd()"  placeholder="Select  Type SGBD"  />
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
        const Items = ref(["MYSQL", "ORACLE", "SQL SERVER"])
        const type_sgbd = ref("")
        onMounted(() => {
            getType();
        })

        const getType = () => {
            type_sgbd.value = GetElement(element, 'neo:TypeSgbd', 'TypeSgbd')
        }

        const AddTypeSgbd = () => {
            AddElement(element, bpmnElementfactory, 'neo:TypeSgbd', 'TypeSgbd', type_sgbd.value);
            emit("RefreshDiagram");
        }

        return {
            element,
            bpmnElementfactory,
            type_sgbd,
            Items,
            AddTypeSgbd,
            getType
        }
    }
})
</script>

<style>
.dropdown_content{
    padding: 15px;
}
</style>