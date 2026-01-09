<template>
  <div class="map-wrapper" ref="mapContainer">

    <div v-if="loading" class="loading-overlay">
      Chargement du plan...
    </div>

    <img
        src="@/assets/images/IMp-PLAN-VF1.png"
        alt="Plan Necronomi'con"
        class="map-bg"
    />

    <svg class="map-overlay" viewBox="0 0 1133 938" preserveAspectRatio="none">
      <g
          v-for="stand in visibleStands"
          :key="stand.id"
          class="stand-group"
          @click="handleStandClick(stand, $event)"
      >
        <path
            :d="stand.pathData"
            :class="['stand-zone', stand.status, { 'is-interactive': isInteractive(stand), 'is-highlighted': stand.id === highlightId }]"
        />

        <text v-if="false" x="50%" y="50%" class="stand-text">
          {{ stand.zone_id }}
        </text>
      </g>
    </svg>

    <Teleport to="body">
      <div v-if="selectedStand" class="map-popup" :style="popupStyle">
        <button class="close-btn" @click="closePopup">×</button>

        <div class="popup-header">
          <h3>{{ selectedStand.label || selectedStand.zone_id }}</h3>
          <span :class="['status-badge', selectedStand.status]">
          {{ translateStatus(selectedStand.status) }}
        </span>
        </div>

        <div class="popup-body">

          <div v-if="selectedStand.status === 'occupied' && selectedStand.prestataire">
            <p class="prestataire-name">{{ selectedStand.prestataire.name }}</p>
            <div class="prestataire-desc" v-html="selectedStand.prestataire.description"></div>

            <button
                v-if="getPrestationLink(selectedStand.prestataire.id)"
                @click="goToPrestation(selectedStand.prestataire.id)"
                class="btn-link"
                style="background:none; border:none; padding:0; font:inherit; cursor:pointer;"
            >
              Voir la fiche
            </button>
            <span v-else class="text-gray-400 text-sm italic">Fiche non disponible</span>

            <button v-if="canModerate" @click="updateStandStatus(selectedStand, 'free')" class="btn-danger mt-2">
              Admin: Libérer ce stand
            </button>
          </div>

          <div v-else-if="selectedStand.status === 'free'">
            <p>Cet emplacement est disponible.</p>

            <button v-if="canBook" @click="requestBooking(selectedStand)" class="btn-primary">
              Réserver ce stand
            </button>

            <p v-if="canModerate" class="admin-hint">En tant qu'admin, attendez une demande.</p>

            <p v-if="!currentUser && enableActions" class="info-text">
              Connectez-vous pour réserver.
            </p>
          </div>

          <div v-else-if="selectedStand.status === 'pending'">
            <p><strong>Demande en cours :</strong></p>

            <div v-if="selectedStand.prestataire">
              <p class="prestataire-name">{{ selectedStand.prestataire.name }}</p>

              <div v-if="currentUser && selectedStand.prestataire.id === currentUser.id"
                   class="prestataire-desc mt-2"
                   v-html="currentUser.description">
              </div>

              <div v-else
                   class="prestataire-desc mt-2"
                   v-html="selectedStand.prestataire.description">
              </div>
            </div>

            <div v-if="canModerate" class="admin-actions">
              <button @click="updateStandStatus(selectedStand, 'occupied')" class="btn-success">Valider</button>
              <button @click="updateStandStatus(selectedStand, 'free')" class="btn-danger">Refuser</button>
            </div>

            <p v-else-if="!selectedStand.prestataire">Demande en cours d'examen par l'organisation.</p>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import {ref, onMounted, computed} from 'vue';
import StandService from '@/services/standService';

const props = defineProps({
  currentUser: {
    type: Object,
    default: null
  },
  enableActions: {
    type: Boolean,
    default: true
  },
  highlightId: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['stand-updated']);

const stands = ref([]);
const loading = ref(true);
const selectedStand = ref(null);
const mapContainer = ref(null);
const popupPos = ref({x: 0, y: 0});

const canModerate = computed(() => {
  if (!props.enableActions || !props.currentUser) return false;
  return props.currentUser.roles?.includes('admin') || props.currentUser.role === 'admin';
});

const canBook = computed(() => {
  if (!props.enableActions || !props.currentUser) return false;
  return props.currentUser.roles?.includes('prestataire') || props.currentUser.role === 'prestataire';
});

onMounted(async () => {
  await loadData();
});

async function loadData() {
  loading.value = true;
  try {
    stands.value = await StandService.getAllStands();
  } catch (e) {
    console.error("Erreur chargement map:", e);
  } finally {
    loading.value = false;
  }
}


const visibleStands = computed(() => {
  if (loading.value) return [];

  return stands.value.filter(stand => {
    if (props.enableActions) return true;

    if (stand.status === 'occupied') return true;

    if (props.highlightId && stand.id === props.highlightId) return true;

    return false;
  });
});

function isInteractive(stand) {
  if (!props.enableActions) {
    return stand.status === 'occupied';
  }

  if (canModerate.value) return true;
  if (stand.status === 'occupied') return true;
  if (stand.status === 'free' && canBook.value) return true;

  return false;
}

function handleStandClick(stand, event) {
  if (!isInteractive(stand)) return;

  selectedStand.value = stand;

  popupPos.value = {
    x: event.pageX + 20,
    y: event.pageY + 20,
    clientX: event.clientX
  };
}

function closePopup() {
  selectedStand.value = null;
}

const popupStyle = computed(() => {
  const isTooRight = popupPos.value.clientX > (window.innerWidth * 0.6);

  const style = {
    top: `${popupPos.value.y}px`,
  };

  if (isTooRight) {
    style.right = `${document.body.clientWidth - popupPos.value.x + 40}px`;
    style.left = 'auto';
  } else {
    style.left = `${popupPos.value.x}px`;
    style.right = 'auto';
  }

  return style;
});


async function requestBooking(stand) {
  if (!props.currentUser) return;

  const result = await StandService.requestStand(stand.id, props.currentUser);
  if (result) {
    await loadData();
    closePopup();
    emit('stand-updated');
  }
}

async function updateStandStatus(stand, newStatus) {
  const result = await StandService.updateStatus(stand.id, newStatus);
  if (result) {
    await loadData();
    closePopup();
    emit('stand-updated');
  }
}

function translateStatus(status) {
  switch (status) {
    case 'free':
      return 'Libre';
    case 'occupied':
      return 'Occupé';
    case 'pending':
      return 'En attente';
    default:
      return status;
  }
}


import { prestations } from '@/datasource/data.js';

function getPrestationLink(prestataireId) {
  const found = prestations.find(p => p.prestataireId === prestataireId);

  if (found) {
    return { name: 'PrestationDetail', params: { id: found.id } };
  }
  return null;
}

import { useRouter } from 'vue-router';
const router = useRouter();

function goToPrestation(prestataireId) {
  const route = getPrestationLink(prestataireId);
  if (route) {
    router.push(route);
  } else {
    console.warn("Aucune prestation trouvée pour ce prestataire");
  }
}
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.map-bg {
  display: block;
  width: 100%;
  height: auto;
  pointer-events: none;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
}

.stand-zone {
  fill: transparent;
  stroke: transparent;
  stroke-width: 2px;
  transition: all 0.2s ease;
  cursor: default;
}

.stand-zone.is-interactive {
  cursor: pointer;
}

.stand-zone.is-interactive:hover {
  stroke: #fff;
  stroke-width: 3px;
  filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.5));
}

.stand-zone.free {
  fill: rgba(46, 204, 113, 0.2);
  stroke: rgba(46, 204, 113, 0.4);
}

.stand-zone.free.is-interactive:hover {
  fill: rgba(46, 204, 113, 0.5);
}

.stand-zone.occupied {
  fill: rgba(52, 152, 219, 0.0);
}

.stand-zone.occupied.is-interactive:hover {
  fill: rgba(52, 152, 219, 0.3);
}

.stand-zone.pending {
  fill: rgba(243, 156, 18, 0.3);
  stroke: rgba(243, 156, 18, 0.8);
  stroke-dasharray: 8, 4;
  animation: pulseZone 2s infinite;
}

.stand-zone.is-highlighted {
  stroke: #5aec00;
  stroke-width: 3px;
  filter: drop-shadow(0 0 6px rgba(137, 255, 104, 0.8));
  fill-opacity: 0.8;
  z-index: 50;
}

@keyframes pulseZone {
  0% {
    fill-opacity: 0.3;
  }
  50% {
    fill-opacity: 0.6;
  }
  100% {
    fill-opacity: 0.3;
  }
}

.map-popup {
  position: absolute;
  width: 280px;
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 100;
  border: 1px solid #eee;
  font-family: sans-serif;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #888;
}

.popup-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.status-badge {
  font-size: 0.75rem;
  padding: 3px 6px;
  border-radius: 4px;
  font-weight: bold;
  text-transform: uppercase;
}

.status-badge.free {
  background: #d4edda;
  color: #155724;
}

.status-badge.occupied {
  background: #cce5ff;
  color: #004085;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.btn-primary, .btn-danger, .btn-success {
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  margin-top: 5px;
  cursor: pointer;
  color: white;
  font-size: 0.9rem;
}

.btn-primary {
  background: #3498db;
}

.btn-danger {
  background: #e74c3c;
}

.btn-success {
  background: #2ecc71;
  margin-right: 5px;
}

.btn-link {
  color: #3498db;
  text-decoration: underline;
  font-size: 0.9rem;
}

.admin-actions {
  margin-top: 10px;
  display: flex;
  gap: 5px;
}

.mt-2 {
  margin-top: 10px;
}

.admin-hint {
  font-style: italic;
  font-size: 0.8rem;
  color: #999;
  margin-top: 5px;
}

.info-text {
  font-size: 0.9rem;
  color: #666;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  color: #333;
  font-weight: bold;
}

.prestataire-desc {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
  max-height: 100px;
  overflow-y: auto;
}

.prestataire-desc p {
  margin: 0;
}

.btn-link {
  color: #a855f7;
  text-decoration: underline;
  font-weight: bold;
  margin-top: 8px;
  display: inline-block;
}
.btn-link:hover {
  color: #d8b4fe;
}

</style>