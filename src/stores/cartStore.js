import {defineStore} from "pinia";

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: []
    }),
    actions: {
        addToCart(ticket, userId) {
            const newTicket = {
                uuid: crypto.randomUUID(),
                label: ticket.label,
                price: ticket.price,
                cout: ticket.cout,
                userId: userId
            };
            this.items.push(newTicket);
            alert(`${ticket.label} ajouté au panier`);
        },
        removeFromCart(uuid) {
            this.items = this.items.filter(item => item.uuid !== uuid);
        },
        clearCart() {
            this.items = [];
        }
    },
    getters: {
        totalAmount: (state) => state.items.reduce((total, item) => total + item.cout, 0),
        itemsCount: (state) => state.items.length
    }
})