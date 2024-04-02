<template>
    <div class="form_properties">
        <InputText v-model="requete" type="text" placeholder="select * from table"></InputText>
        <Button class="btn" @click="AddRequete()">Add</Button>
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
        const requete = ref("")
        onMounted(() => {
            getRequete();
        })

        const getRequete = () => {
            requete.value = GetElement(element, 'neo:RequeteSQL', 'requete')
        }

        const AddRequete = () => {
            const businessObject = toRaw(element[3]);
            let extensionElements = businessObject.get('extensionElements');
            if (!extensionElements) {
                extensionElements = createElement('bpmn:ExtensionElements', {}, bpmnElementfactory);
                businessObject.set('extensionElements', extensionElements);
            }
            let RequeteElement = extensionElements.get('values').find(e => e.$type === 'neo:RequeteSQL');
            if (!RequeteElement) {
                RequeteElement = createElement('neo:RequeteSQL', { requete: requete.value }, bpmnElementfactory);
                extensionElements.get('values').push(RequeteElement);
            } else {
                RequeteElement.requete = requete.value;
            }
            emit("RefreshDiagram");
        }

        return {
            element,
            bpmnElementfactory,
            requete,
            AddRequete,
            getRequete
        }
    }
})
</script>