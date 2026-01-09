import {defineStore} from "pinia";

export const useCartStore = defineStore('cart', {
    state: () => {
        const storedConfirmed = localStorage.getItem('confirmedTickets')
        return {
            items: [],
            confirmedTickets: storedConfirmed ? JSON.parse(storedConfirmed) : []
        }
    },
    actions: {
        addToCart(ticket, userId) {
            const newTicket = {
                uuid: crypto.randomUUID(),
                label: ticket.label,
                price: ticket.price,
                cout: ticket.cout,
                userId: userId,
                holderName: '',
                holderBirthDate: '',

                holderEmail: '',
                purchaseDate: ''
            };
            this.items.push(newTicket);
            alert(`${ticket.label} ajouté au panier`);
        },
        updateInfoTicket(uuid, info) {
            const index = this.items.findIndex(item => item.uuid === uuid);
            if (index !== -1) {
                this.items[index] = { ...this.items[index], ...info };
            }
        },
        removeFromCart(uuid) {
            this.items = this.items.filter(item => item.uuid !== uuid);
        },
        clearCart() {
            this.items = [];
        },
        validateCart(){

        },
        confirmTickets() {
            /*
            this.confirmedTickets = [...this.confirmedTickets, ...this.items];
            */
            const now = new Date().toLocaleDateString();
            const ticketsToConfirm = this.items.map(item => ({
                ...item,
                purchaseDate: now
            }));
            this.confirmedTickets.push(...ticketsToConfirm);
            localStorage.setItem('confirmedTickets', JSON.stringify(this.confirmedTickets));
            this.clearCart();
        }
    },
    getters: {
        totalAmount: (state) => state.items.reduce((total, item) => total + item.cout, 0),

        itemsCount: (state) => state.items.length,
        userConfirmedTickets: (state) => (email) => {
            return state.confirmedTickets.filter(t => t.holderEmail === email);
        }
    }
})