<template>
    <div class="config">
        <div class="card">
            <Toolbar class="config_content">
                <template #start>
                    <Button label="Execution" icon="pi pi-play" iconPos="right" raised @click="ToggleSimulation()" />
                </template>
                <template #center>
                </template>
                <template #end>
                    <div class="list_config">
                        <Button v-for="item in items" :icon="item.icon"
                            v-tooltip.top="{ value: item.tooltip, showDelay: 100, hideDelay: 100 }"
                            @click="item.command" />
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
    },
    emits: ['importDiagram', 'resetDiagram', 'downloadDiagramXml', 'SaveDiagram', 'downloadDiagramSvg', 'ToggleSimulation'],
    setup(props, { emit }) {
        const ToggleSimulation = () => {
            emit("ToggleSimulation")
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
            }
        ])

        return {
            items,
            ToggleSimulation,
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