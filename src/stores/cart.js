import { reactive } from 'vue';

export const cart = reactive({
    items: [],
    addToCart(product) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
    },
    get total() {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }
});
