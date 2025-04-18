<!-- pages/categories/Show.vue -->
<template>
    <div>
        <h2>Category Details</h2>
        <p><strong>Name:</strong> {{ category.name }}</p>
        <p><strong>Code:</strong> {{ category.code }}</p>
        <router-link to="/categories">Back to List</router-link>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const categoryId = route.params.id;

const category = ref({ name: 'Sample Category', code: 'SAMPLE' });
// Fetch logic can be added here based on categoryId
</script>