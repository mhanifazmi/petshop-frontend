<!-- pages/categories/Edit.vue -->
<template>
    <div>
        <h2>Edit Category</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="form.name" class="form-control" />
            </div>
            <div class="mb-3">
                <label class="form-label">Code</label>
                <input v-model="form.code" class="form-control" />
            </div>
            <button class="btn btn-success">Update</button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const categoryId = route.params.id;

const form = reactive({
    name: 'Sample Edit',
    code: 'EDITED'
});

function handleSubmit() {
    console.log('Updating', form);
    // Call API to update
}
</script>