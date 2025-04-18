<template>
    <div>
        <button @click="logout">Logout</button>
    </div>
</template>

<script>
export default {
    methods: {
        logout() {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            this.$router.push("/login");
        },
    },
};
</script>