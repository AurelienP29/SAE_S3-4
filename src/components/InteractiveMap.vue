<template>
  <div class="admin-controls">
    <h2>Modes d'Édition</h2>
    <div class="radio-group">
      <label>
        <input type="radio" v-model="editMode" value="drag"> Déplacer
      </label><br>
      <label>
        <input type="radio" v-model="editMode" value="add"> Ajouter
      </label><br>
      <label>
        <input type="radio" v-model="editMode" value="delete"> Supprimer
      </label>
    </div>

    <div v-if="editMode === 'add'" class="add-config">
      <label for="new-label">Nom nouveau point :</label>
      <input id="new-label" type="text" v-model="newPointLabel" placeholder="Ex: Entrée principale">
    </div>
  </div>

  <div
      class="map-container"
      :class="`mode-${editMode}`"
      @click="addPoint"
  >
    <img src="/public/images/Placeholder.png" alt="Interactive Map" class="map-image"/>

    <div
        v-for="point in points"
        :key="point.id"
        class="map-point"
        :style="{
        top: point.y + '%',
        left: point.x + '%'
      }"
        @mousedown.stop="startDrag(point, $event)"
        @click.stop="handlePointClick(point)"
        :class="{
        'is-dragging': draggingPoint && draggingPoint.id === point.id,
        'is-deleting': editMode === 'delete',
        'is-draggable': editMode === 'drag' // Nouvelle classe pour le curseur
      }"
        tabindex="0"
    >
      <div class="pin-shape"></div>
      <div class="tooltip">{{ point.label }}</div>
    </div>
  </div>

  <div v-if="pointToDelete" class="modal-overlay">
    <div class="modal-content">
      <p>Supprimer point "{{ pointToDelete.label }}" ?</p>
      <button @click="executeDelete" class="btn-confirm">Oui</button>
      <button @click="cancelDelete" class="btn-cancel">Annuler</button>
    </div>
  </div>

  <pre class="debug-output">Points : {{ points.length }} | Mode : {{ editMode }}</pre>
</template>

<script setup>
import {ref, watch} from "vue";

const STORAGE_KEY = 'interactive_map_points';

function loadPoints() {
  const storedPoints = localStorage.getItem(STORAGE_KEY);
  if (storedPoints) {
    try {
      return JSON.parse(storedPoints);
    } catch (e) {
      console.error("Erreur lors du chargement des points:", e);
    }
  }
  return [
    {id: 1, x: 25, y: 40, label: 'Test n°1'},
    {id: 2, x: 60, y: 70, label: 'Test n°2'},
  ];
}
const points = ref(loadPoints());
let nextId = points.value.length > 0 ? Math.max(...points.value.map(p => p.id)) + 1 : 1;
watch(points, (newPoints) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newPoints));
}, { deep: true });

const editMode = ref('drag');
const newPointLabel = ref('Nouveau Point');
const pointToDelete = ref(null);
const draggingPoint = ref(null);
let startMouseX = 0;
let startMouseY = 0;

function startDrag(point, event) {
  if (editMode.value !== 'drag') return;

  event.preventDefault();
  draggingPoint.value = point;
  startMouseX = event.clientX;
  startMouseY = event.clientY;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  document.body.classList.add('dragging-active');
}

function onDrag(event) {
  if (!draggingPoint.value) return;

  const mapContainer = document.querySelector('.map-container');
  if (!mapContainer) return;

  const rect = mapContainer.getBoundingClientRect();
  const mapWidth = rect.width;
  const mapHeight = rect.height;

  const deltaX = event.clientX - startMouseX;
  const deltaY = event.clientY - startMouseY;

  const currentX_px = (draggingPoint.value.x / 100) * mapWidth;
  const currentY_px = (draggingPoint.value.y / 100) * mapHeight;

  const newX_px = currentX_px + deltaX;
  const newY_px = currentY_px + deltaY;

  let newX_pct = (newX_px / mapWidth) * 100;
  let newY_pct = (newY_px / mapHeight) * 100;

  newX_pct = Math.min(100, Math.max(0, newX_pct));
  newY_pct = Math.min(100, Math.max(0, newY_pct));

  draggingPoint.value.x = newX_pct;
  draggingPoint.value.y = newY_pct;

  startMouseX = event.clientX;
  startMouseY = event.clientY;
}

function stopDrag() {
  if (!draggingPoint.value) return;
  draggingPoint.value = null;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  document.body.classList.remove('dragging-active');
  console.log('Déplacement terminé, données sauvegardées.');
}

function addPoint(event) {
  if (editMode.value !== 'add') return;

  const mapContainer = event.currentTarget;
  const rect = mapContainer.getBoundingClientRect();

  const clickX_px = event.clientX - rect.left;
  const clickY_px = event.clientY - rect.top;

  if (clickX_px < 0 || clickX_px > rect.width || clickY_px < 0 || clickY_px > rect.height) {
    return;
  }

  const newX_pct = (clickX_px / rect.width) * 100;
  const newY_pct = (clickY_px / rect.height) * 100;

  const newPoint = {
    id: nextId++,
    x: newX_pct,
    y: newY_pct,
    label: newPointLabel.value
  };

  points.value.push(newPoint);
  console.log(`Point ajouté: ${newPoint.label}`);
}

function confirmDelete(pointId) {
  if (editMode.value === 'delete') {
    pointToDelete.value = points.value.find(p => p.id === pointId);
  }
}

function executeDelete() {
  if (pointToDelete.value) {
    const index = points.value.findIndex(p => p.id === pointToDelete.value.id);
    if (index !== -1) {
      points.value.splice(index, 1);
      console.log(`Point ID ${pointToDelete.value.id} supprimé.`);
    }
    pointToDelete.value = null;
  }
}

function cancelDelete() {
  pointToDelete.value = null;
}

function handlePointClick(point) {
  if (editMode.value === 'delete') {
    confirmDelete(point.id);
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  display: inline-block;
  border: 2px dashed transparent;
}

.map-image {
  display: block;
  max-width: 100%;
  height: auto;
}

.map-point {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: default;
}

.pin-shape {
  width: 20px;
  height: 30px;
  background-color: red;
  border-radius: 50%;
  position: relative;
  transition: background-color 0.2s, transform 0.2s;
}

.pin-shape::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 10px solid red;
}

.map-point:focus .pin-shape {
  outline-offset: 3px;
}

.tooltip {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  font-size: 13px;
  z-index: 50;
}

.map-point:hover .tooltip,
.map-point:focus .tooltip {
  opacity: 1;
}

.map-point.is-draggable {
  cursor: grab;
}
.map-point.is-draggable:active,
.dragging-active {
  cursor: grabbing !important;
  user-select: none;
}
.map-point.is-dragging {
  z-index: 100;
  transform: translate(-50%, -100%) scale(1.1);
  transition: none;
}

.map-container.mode-drag .map-point:not(.is-draggable) {
  cursor: default;
}


.map-container.mode-add {
  cursor: crosshair;
}

.map-container.mode-add .map-point {
  cursor: default;
}

.map-container.mode-delete .map-point {
  cursor: pointer;
}
.map-point.is-deleting:hover .pin-shape {
  transform: scale(1.1);
}

.admin-controls {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.radio-group label {
  margin-right: 15px;
  font-weight: 500;
  cursor: pointer;
}
.add-config {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
.add-config input {
  padding: 5px;
  margin-left: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.debug-output {
  margin-top: 20px;
  background: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  font-size: 12px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
}
.modal-content {
  background: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  text-align: center;
}
.modal-content p {
  margin: 15px 0;
}
.btn-confirm, .btn-cancel {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
}
.btn-confirm {
  background-color: #dc3545;
  color: white;
}
.btn-cancel {
  background-color: #f8f9fa;
  color: #343a40;
  border: 1px solid #ccc;
}
</style>