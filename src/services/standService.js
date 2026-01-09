import {mapStands} from '@/datasource/mapStands.js';

const USE_API = false;
const API_URL = 'http://localhost:3000/api';

let localStands = [...mapStands];

export default {
    async getAllStands() {
        if (USE_API) {
            const response = await fetch(`${API_URL}/stands`);
            return await response.json();
        } else {
            return new Promise((resolve) => {
                setTimeout(() => resolve(localStands), 500);
            });
        }
    },

    async requestStand(standId, user) {
        if (USE_API) {
            // TODO S4
        } else {
            return new Promise((resolve) => {
                const index = localStands.findIndex(s => s.id === standId);
                if (index !== -1) {
                    localStands[index].status = 'pending';

                    localStands[index].prestataire = {
                        id: user.id,
                        name: user.name,
                        description: user.description
                    };
                    resolve({success: true});
                }
            });
        }
    },

    async updateStatus(standId, newStatus) {
        if (USE_API) {
            // TODO S4
        } else {
            return new Promise((resolve) => {
                const index = localStands.findIndex(s => s.id === standId);
                if (index !== -1) {
                    localStands[index].status = newStatus;

                    if (newStatus === 'free') {
                        localStands[index].prestataire = null;
                    }

                    resolve({success: true, stand: localStands[index]});
                }
            });
        }
    }
};