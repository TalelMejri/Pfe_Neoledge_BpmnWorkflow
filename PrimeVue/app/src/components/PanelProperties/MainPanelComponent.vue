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
                    <Accordion :activeIndex="0">
                        <AccordionTab header="Header I">
                            <p class="m-0">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                                sunt in culpa qui officia deserunt mollit anim id est
                                laborum.
                            </p>
                        </AccordionTab>
                        <AccordionTab header="Header II">
                            <p class="m-0">
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                                veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo
                                enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia
                                consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Consectetur,
                                adipisci velit, sed quia non numquam eius modi.
                            </p>
                        </AccordionTab>
                        <AccordionTab header="Header III">
                            <p class="m-0">
                                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                                praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias
                                excepturi sint occaecati cupiditate non provident, similique sunt in
                                culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum
                                quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta
                                nobis est eligendi optio cumque nihil impedit quo minus.
                            </p>
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
export default defineComponent({
    props: {
        element: {
            type: Array,
            required: true
        }
    },
    components: {
        CommentComponent
    },
    methods: {
        ChangeName() {
           
        }
    },
    emits: [],
    setup(props, { emit }) {
        const name = ref(props.element[3]["name"]);
        const id = ref(props.element[0]);
        return {
            element: props.element,
            name,
            id,
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
</style>