import Axios from "axios";
const API_URL = "http://localhost:5182/api";
export default {
    getProcessusById(id: any) {
        return Axios.get(`${API_URL}/processus/${id}`);
    },
    UploadProcessus(content: any, data: any) {
        const formData = new FormData();
        formData.append('Content', content);
        formData.append('Data', JSON.stringify(data));
        return Axios.post(`${API_URL}/bpmn`, formData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    },
    getDiagrammesByProcessusHistory(id: any) {
        return Axios.get(`${API_URL}/processus/${id}/Diagrammes`);
    },
    addHistoryAndDiagramWithChangesToProcessus(processusId: any, historyAndDiagramData: any) {
        return Axios.post(`${API_URL}/processus/${processusId}/HistoryAndDiagramWithChanges`, historyAndDiagramData);
    }
}