<template>
    <div>
        <div class="comment-section">
            <div v-if="Comments != ''">
                <div v-for="(CommentValue, index) in Comments">
                    <div class="comment-header">
                        <span class="comment-user">{{ CommentValue.IdUser }}</span>
                        <span class="comment-date">12/05/02</span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center comment-text">
                        <div class="p-2">
                            {{ CommentValue.comment }}
                        </div>
                        <div>
                            <Button @click="deleteComment(index)" class="btn danger">Delete</Button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="no-comments py-5 mt-5">
                    NO Comments Yet
                </div>
            </div>
            <div class="input-container">
                <InputText class="input" type="text" v-model="commentInput" placeholder="Enter your comment..." />
                <Button @click="addComments()">Add</Button>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted } from 'vue'
import { AddElementComposer, DeleteElement, GetContentElements, } from "../../../GererElement/utils.js";

export default defineComponent({
    props: {
        element: {
            type: Array,
            required: true
        },
        bpmnElementfactory: {
            type: Object,
            required: true
        },
    },
    setup(props) {
        const Comments = ref([])
        const commentInput = ref("");
        const element = props.element;
        const bpmnElementfactory = props.bpmnElementfactory;

        onMounted(() => {
            GetComments();
        })

        const deleteComment = (index) => {
            Comments.value.splice(index, 1);
            DeleteElement(
                element,
                'neo:CommentTask',
                bpmnElementfactory,
                "comments",
                Comments.value,
                'neo:Comment',
                "IdUser",
                "value"
            );
            GetComments();
        }

        const GetComments = () => {
            Comments.value = GetContentElements(element, "neo:CommentTask", "comments", "IdUser");
        }

        const addComments = () => {
            AddElementComposer(
                element,
                bpmnElementfactory,
                "neo:CommentTask",
                "neo:Comment",
                "comments",
                "IdUser",
                2,
                commentInput.value
            );
            GetComments();
        }

        return {
            deleteComment,
            addComments,
            Comments,
            commentInput,
            element,
            bpmnElementfactory,
            GetComments
        }
    }

})
</script>

<style scoped>
.comment-section {
    margin-top: 30px;
    max-width: 800px;
    margin: auto;
}

.comment-header {
    display: flex;
    margin-top: 9px;
    justify-content: space-between;
    margin-bottom: 5px;
}

.comment-user {
    font-weight: bold;
}

.comment-date {
    color: #666;
}

.comment-text {
    padding: 5px;
    background-color: #f2f2f2;
    border-radius: 5px;
    margin-bottom: 10px;
}

.no-comments {
    color: #666;
}

.input-container {
    position: fixed;
    bottom: 0;
    border-radius: 25px;
    box-shadow: 0 -2px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    padding: 11px 5px;
    gap: 4px;
}
</style>