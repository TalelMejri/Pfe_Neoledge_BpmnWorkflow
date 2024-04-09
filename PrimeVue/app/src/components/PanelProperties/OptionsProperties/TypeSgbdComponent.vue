<template>
    <div class="dropdown_content">
        <Dropdown v-model="type_sgbd" :options="Items"  placeholder="Select  Type SGBD"  />
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
        const Items = ref(["MYSQL", "ORACLE", "SQL SERVER"])
        const type_sgbd = ref("")
        onMounted(() => {
            getType();
        })

        const getType = () => {
            type_sgbd.value = GetElement(element, 'neo:TypeSgbd', 'TypeSgbd')
        }

        const AddTypeSgbd = () => {
            const businessObject = toRaw(element[3]);
            let extensionElements = businessObject.get('extensionElements');
            if (!extensionElements) {
                extensionElements = createElement('bpmn:ExtensionElements', {}, bpmnElementfactory);
                businessObject.set('extensionElements', extensionElements);
            }
            let typeSgbd = extensionElements.get('values').find(e => e.$type === 'neo:TypeSgbd');
            if (!typeSgbd) {
                typeSgbd = createElement('neo:TypeSgbd', { TypeSgbd: type_sgbd.value }, bpmnElementfactory);
                extensionElements.get('values').push(typeSgbd);
            } else {
                typeSgbd.TypeSgbd = type_sgbd.value;
            }
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