<!-- pages/categories/Create.vue -->
<template>
    <div>
        <h2>Create Category</h2>
        <form @submit.prevent="handleSubmit">
            <div class="mb-3">
                <label class="form-label">Name</label>
                <input v-model="form.name" class="form-control" />
            </div>
            <div class="mb-3">
                <label class="form-label">Code</label>
                <input v-model="form.code" class="form-control" />
            </div>
            <button class="btn btn-primary">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { reactive } from 'vue';

const form = reactive({
    name: '',
    code: ''
});

function handleSubmit() {
    console.log('Submitted', form);
    // Here you'd call your API
}
</script>