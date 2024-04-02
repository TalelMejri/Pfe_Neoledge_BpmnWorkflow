<template>
    <select v-model="type_sgbd" @change="AddTypeSgbd">
        <option v-for="item in Items" :key="item" :value="item">{{ item }}</option>
    </select>
    <!-- <div class="accordion-item" v-if="element[2].split(':')[1] === 'BusinessRuleTask'">
        <h2 class="accordion-header" id="headingPython">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#headerPython" aria-expanded="false" aria-controls="headerPython">
                Connection String BD
            </button>
        </h2>
        <div id="headerPython" class="accordion-collapse collapse" aria-labelledby="headingPython"
            data-bs-parent="#accordionExample">
            <div class="accordion-body">
                <div class="content_prop">
                    <div class="card  mb-2">
                        <div class="card-body">
                            <input type="text" class="form-control" placeholder="ConnectionString"
                                v-model="ConnectionString">
                        </div>
                        <div class="d-flex gap-2 justify-content-center mb-2">
                            <button class="btn btn-primary" @click="AddConnectionString()">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="accordion-item" v-if="element[2].split(':')[1] === 'BusinessRuleTask'">
        <h2 class="accordion-header" id="headingPath">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                data-bs-target="#taskPath" aria-expanded="false" aria-controls="taskPath">
                Requete SQl
            </button>
        </h2>
        <div id="taskPath" class="accordion-collapse collapse " aria-labelledby="headingPath"
            data-bs-parent="#accordionExample">
            <div class="accordion-body">
                <input class="form-control" v-model="requet_sql" type="text" placeholder="select * from table" />
                <button @click="AddRequete()">Add </button>
            </div>
        </div>
    </div> -->
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