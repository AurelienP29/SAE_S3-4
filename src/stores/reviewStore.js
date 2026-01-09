import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useReviewStore = defineStore('reviews', () => {
    const storedReviews = localStorage.getItem('prestation_reviews');

    // Review tempo, à déplacer
    const reviews = ref(storedReviews ? JSON.parse(storedReviews) : [
        {
            id: 1,
            prestationId: 1,
            userId: 3,
            userName: 'Visiteur User',
            rating: 5,
            comment: 'La bièraubeurre est incroyable',
            date: '2026-01-05'
        },
        {
            id: 2,
            prestationId: 2,
            userId: 3,
            userName: 'Visiteur User',
            rating: 4,
            comment: 'Très bons ramen, mais un peu d\'attente aux heures de pointe.',
            date: '2026-01-06'
        }
    ]);

    function saveToLocalStorage() {
        localStorage.setItem('prestation_reviews', JSON.stringify(reviews.value));
    }

    function addReview(reviewData) {
      // reviews.value.push(reviewData)
        const newReview = {
            id: Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...reviewData
        };
        reviews.value.push(newReview);
        saveToLocalStorage();
        return newReview;
    }

    function updateReview(id, updatedData) {
        const index = reviews.value.findIndex(r => r.id === id);
        if (index !== -1) {
            reviews.value[index] = { ...reviews.value[index], ...updatedData };
            saveToLocalStorage();
        }
    }

    function deleteReview(id) {
        /*
        const index = reviews.value.findIndex(r => r.id === id);
        reviews.value.splice(index, 1);
        */
        reviews.value = reviews.value.filter(r => r.id !== id);
        saveToLocalStorage();
    }

    const getReviewsByPrestation = computed(() => (prestationId) => {
        return reviews.value.filter(r => r.prestationId === prestationId);
    });

    const getReviewsByUser = computed(() => (userId) => {
        return reviews.value.filter(r => r.userId === userId);
    });

    const getAverageRating = computed(() => (prestationId) => {
        const prestationReviews = reviews.value.filter(r => r.prestationId === prestationId);
        if (prestationReviews.length === 0) return 0;
        const sum = prestationReviews.reduce((acc, r) => acc + r.rating, 0);
        return (sum / prestationReviews.length).toFixed(1);
    });

    return {
        reviews,
        addReview,
        updateReview,
        deleteReview,
        getReviewsByPrestation,
        getReviewsByUser,
        getAverageRating
    };
});
