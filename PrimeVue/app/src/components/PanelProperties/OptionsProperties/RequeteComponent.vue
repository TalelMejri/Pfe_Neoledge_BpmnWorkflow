<template>
    <div class="form_properties">
        <InputText v-model="requete" type="text" placeholder="select * from table"></InputText>
        <Button class="btn" @click="AddRequete()">Add</Button>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted, toRaw } from 'vue'
import { GetElement,AddElement } from "../../../GererElement/utils.ts";
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
            AddElement(element, bpmnElementfactory, 'neo:RequeteSQL', 'requete', requete.value);
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