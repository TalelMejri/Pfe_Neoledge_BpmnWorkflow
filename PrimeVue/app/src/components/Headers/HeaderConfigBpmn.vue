<template>
    <div class="config">
        <div class="card">
            <Toolbar class="config_content">
                <template #start>
                    <Button v-if="!xml_viewer" label="Execution" icon="pi pi-play" iconPos="right" raised @click="ToggleSimulation()" />
                </template>
                <template #center>
                </template>
                <template #end>
                    <div class="list_config" v-if="!xml_viewer">
                        <Button v-for="item in items" :icon="item.icon"
                            v-tooltip.top="{ value: item.tooltip, showDelay: 100, hideDelay: 100 }"
                            @click="item.command" />
                    </div>
                    <div v-else @click="BackModeling()">
                        <Button>Back to modeling view</Button>
                    </div>
                </template>
            </Toolbar>
        </div>
    </div>
</template>

<script>
import { ref, defineComponent } from 'vue'
export default defineComponent({
    props: {
        xml_viewer: Boolean
    },
    emits: ['importDiagram', 'BackModeling', 'resetDiagram', 'editXML', 'downloadDiagramXml', 'SaveDiagram', 'downloadDiagramSvg', 'ToggleSimulation'],
    setup(props, { emit }) {
        const ToggleSimulation = () => {
            emit("ToggleSimulation")
        }
        const BackModeling = () => {
            emit("BackModeling")
        }
        const items = ref([
            {
                label: 'Download',
                icon: 'pi pi-download',
                tooltip: "Download as XML",
                command: () => {
                    emit("downloadDiagramXml");
                }
            },
            {
                label: 'Save',
                icon: 'pi pi-image',
                tooltip: "Save as SVG",
                command: () => {
                    emit("downloadDiagramSvg")
                }
            },
            {
                label: 'Refresh',
                tooltip: "Reset Diagram",
                icon: 'pi pi-refresh',
                command: () => {
                    emit("resetDiagram")
                }
            },


            {
                label: 'Upload',
                tooltip: "Import Diagram",
                icon: 'pi pi-upload',
                command: () => {
                    emit("importDiagram");
                }
            },
            {
                label: 'Save',
                tooltip: "Save Diagram",
                icon: 'pi pi-save',
                command: () => {
                    emit("SaveDiagram")
                }
            },
            {
                label: 'Edit',
                tooltip: "Edit XML",
                icon: 'pi pi-code',
                command: () => {
                    emit("editXML")
                }
            },
        ])

        return {
            items,
            ToggleSimulation,
            BackModeling
        }
    }

})
</script>

<style scoped>
.config_content {
    padding: 15px;
}

.config_content Button {
    padding: 5px;
}

.list_config {
    margin-right: 25px;
    display: flex;
    gap: 12px;
}

.p-toolbar-group-center {
    padding: 50px !important;
}

.p-tooltip-text {
    padding: 50px !important;

}
</style>