import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const DiagramChanges = defineStore('DiagramChanges', {
    state: () => ({
        Diagram: JSON.parse(localStorage.getItem("Diagram") || 'null')
    }),
    getters: {
        getDiagram: (state) => state.Diagram
    },
    actions: {
        AddDiagram(diagramData: any) {
            const existingDiagram = JSON.parse(localStorage.getItem("Diagram") || 'null');
            if (!existingDiagram) {
                const currentDate = new Date();
                diagramData.Heure = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
                diagramData.Day = currentDate.getDate();
                diagramData.Month = currentDate.getMonth() + 1;
                diagramData.Annee = currentDate.getFullYear();
                localStorage.setItem('Diagram', JSON.stringify(diagramData));
                this.Diagram = diagramData;
            } else {
                existingDiagram.DiagrammeCodeXml = diagramData.DiagrammeCodeXml;
                existingDiagram.DiagrammeName = diagramData.DiagrammeName;
                const currentDate = new Date();
                if (!existingDiagram.Changes) {
                    existingDiagram.Changes = [];
                }
                existingDiagram.Heure = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
                existingDiagram.Day = currentDate.getDate();
                existingDiagram.Month = currentDate.getMonth() + 1;
                existingDiagram.Annee = currentDate.getFullYear();
                localStorage.setItem('Diagram', JSON.stringify(existingDiagram));
                this.Diagram = existingDiagram;
            }
        },
        AddChange(change: Change) {
            const existingDiagram = JSON.parse(localStorage.getItem("Diagram") || 'null');
            if (existingDiagram) {
                existingDiagram.Changes.push(change);
                const currentDate = new Date();
                existingDiagram.Heure = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
                existingDiagram.Day = currentDate.getDate();
                existingDiagram.Month = currentDate.getMonth() + 1;
                existingDiagram.Annee = currentDate.getFullYear();
                localStorage.setItem('Diagram', JSON.stringify(existingDiagram));
                this.Diagram = existingDiagram;
            }
        },
        DeleteChanges(){
            const existingDiagram = JSON.parse(localStorage.getItem("Diagram") || 'null');
            if (existingDiagram) {
                existingDiagram.Changes = [];
                localStorage.setItem('Diagram', JSON.stringify(existingDiagram));
                this.Diagram = existingDiagram;
            }
        },
        ClearDiagram() {
            localStorage.removeItem('Diagram');
            this.Diagram = null;
        }
    }
});
