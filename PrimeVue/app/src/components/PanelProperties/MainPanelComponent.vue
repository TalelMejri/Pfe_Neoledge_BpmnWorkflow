<template>
    <div class="card tabs">
        <TabView class="tabs_view">
            <div>
                <TabPanel header="Properties">
                    <div class="NameContent">
                        <p v-if="element[2].split(':')[0] != 'bpmn'">
                            <span class="text" v-if="element[3]['eventDefinitions'] != undefined"> Name : {{
                            element[3]['eventDefinitions'][0]["$type"].split(':')[1] }}</span>
                            <span class="text" v-else> Name : {{ element[3]["$type"].split(':')[1] }}</span>
                        </p>
                        <p v-else>
                            <span class="text">Name : </span> {{ element[2].split(':')[1] }}
                        </p>
                    </div>
                    <Panel class="panel" header="General" toggleable>
                        <InputText class="input" id="Name" v-model="name" @input="ChangeName" />
                        <InputText class="input" id="Id" v-model="id" />
                    </Panel>
                    <Accordion class="accordion" :activeIndex="0">
                        <AccordionTab header="Extension Properties">
                            <div class="card  mb-2" v-for="(prop, index) in properties" :key="index">
                                <p>Name : {{ prop.name }}</p>
                                <p>Value : {{ prop.value }}</p>
                                <div class="d-flex gap-2 justify-content-center mb-2">
                                    <Button class="btn" @click="deleteProperty(index)">Delete</Button>
                                    <Button class="btn edit" @click="showEditModal(index, prop.name, prop.value)">
                                        Edit</Button>
                                </div>
                            </div>
                            <div class="form_properties">
                                <InputText class="input" type="text" placeholder="name" v-model="name_form" />
                                <InputText class="input" type="text" placeholder="value" v-model="value_form" />
                                <Button v-if="showEdit" class="btn edit" @click="updateProperty()">Edit</Button>
                                <Button v-else class="btn" @click="AddProperties()">Add</Button>
                            </div>
                        </AccordionTab>
                    </Accordion>
                </TabPanel>
            </div>
            <div>
                <TabPanel header="Comments">
                    <CommentComponent></CommentComponent>
                </TabPanel>
            </div>
        </TabView>
    </div>
</template>

<script>
import { computed, ref, toRaw, defineComponent } from 'vue'
import CommentComponent from './OptionsProperties/CommentComponent.vue';
import Button from 'primevue/button';
import { createElement, AddElementComposer, DeleteElement, UpdateElement } from "../../GererElement/utils.js";

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
    components: {
        CommentComponent
    },
    emits: ["updateActivityName"],
    setup(props, { emit }) {
        const name = ref(props.element[3]["name"]);
        const bpmnElementfactory = props.bpmnElementfactory;
        const id = ref(props.element[0]);
        const name_form = ref("")
        const value_form = ref("")
        const showEdit = ref(false)
        const element = props.element;
        const properties = ref([])

        const ChangeName = () => {
            emit('updateActivityName', name.value)
        }

        const updateProperty = () => {
            showEdit.value = false
            const index = properties.findIndex(x => x.name == name_form.value)
            properties[index].value = value_form.value
        }

        const AddProperties = () => {
            AddElementComposer(
                element,
                bpmnElementfactory,
                "neo:Properties",
                "neo:Property",
                "properties",
                "name",
                name_form.value,
                value_form.value
            );
        }

        const deleteProperty = (index) => {
            properties.splice(index, 1)
        }

        const showEditModal = (index, name, value) => {
            showEdit.value = true
            name_form.value = name
            value_form.value = value
        }

        return {
            element,
            name,
            id,
            name_form,
            value_form,
            showEdit,
            properties,
            ChangeName,
            updateProperty,
            AddProperties,
            deleteProperty,
            showEditModal
        }
    }
})
</script>

<style scoped>
.tabs {
    padding: 10px;
    margin: 10px;
}

.NameContent {
    display: flex;
    margin-top: 15px;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
    padding: 12px 20px;
}

.panel {
    margin-top: 5px;
    padding: 15px;
    margin-bottom: 8px;
}

.input {
    padding: 3px;
    margin-bottom: 5px;
}

.accordion {
    padding: 15px;
}

.form_properties {
    margin-top: 15px;
}

.btn {
    padding: 4px;
}

.btn.edit {
    background-color: #f0ad4e;
    color: white;
    border: none;
    padding: 4px;
}
</style>