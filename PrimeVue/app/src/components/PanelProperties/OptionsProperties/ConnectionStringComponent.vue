<template>
    <div class="form_properties">
        <InputText v-model="conn" type="text" placeholder="Enter Connection String"></InputText>
        <Button class="btn" @click="AddConnection()">Add</Button>
    </div>
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
        const conn = ref("")
        onMounted(() => {
            GetConn();
        })

        const GetConn = () => {
            conn.value = GetElement(element, 'neo:ConnectionString', 'ConnectionString')
        }

        const AddConnection = () => {
            const businessObject = toRaw(element[3]);
            let extensionElements = businessObject.get('extensionElements');
            if (!extensionElements) {
                extensionElements = createElement('bpmn:ExtensionElements', {}, bpmnElementfactory);
                businessObject.set('extensionElements', extensionElements);
            }
            let ConnectionSgbd = extensionElements.get('values').find(e => e.$type === 'neo:ConnectionString');
            if (!ConnectionSgbd) {
                ConnectionSgbd = createElement('neo:ConnectionString', { ConnectionString: conn.value }, bpmnElementfactory);
                extensionElements.get('values').push(ConnectionSgbd);
            } else {
                ConnectionSgbd.ConnectionString = conn.value;
            }
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