<template>
  <div class="stats-view">

    <!-- En-tête -->
    <div class="stats-header">
      <h2 class="stats-title">
        <i class="pi pi-chart-bar mr-2 text-green"></i>
        <span class="text-purple">{{ lang('admin.stats.title') }}</span>
      </h2>
      <p class="stats-subtitle text-muted">{{ lang('admin.stats.subtitle') }}</p>
    </div>

    <div v-if="loading" class="loading-state">
      <i class="pi pi-spin pi-spinner" style="font-size: 2rem;"></i>
      <p>{{ lang('admin.stats.loading') }}</p>
    </div>

    <div v-else-if="error" class="error-state">
      <i class="pi pi-exclamation-triangle text-warning" style="font-size: 2rem;"></i>
      <p>{{ lang('admin.stats.error') }}</p>
    </div>

    <template v-else>

      <!-- ===== SECTION GESTION ===== -->
      <section class="stats-section">
        <h3 class="section-title">
          <i class="pi pi-cog section-icon"></i>
          {{ lang('admin.stats.management') }}
        </h3>

        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon kpi-icon--orange">
              <i class="pi pi-id-card"></i>
            </div>
            <div class="kpi-body">
              <span class="kpi-value">{{ stats.prestataires?.total ?? '—' }}</span>
              <span class="kpi-label">{{ lang('admin.stats.total_providers') }}</span>
            </div>
          </div>

          <div class="kpi-card kpi-card--alert" v-if="stats.management?.waitingList?.pending > 0">
            <div class="kpi-icon kpi-icon--yellow">
              <i class="pi pi-clock"></i>
            </div>
            <div class="kpi-body">
              <span class="kpi-value">{{ stats.management?.waitingList?.pending ?? '—' }}</span>
              <span class="kpi-label">{{ lang('admin.stats.waitlist_pending') }}</span>
            </div>
          </div>

          <div class="kpi-card" v-else>
            <div class="kpi-icon kpi-icon--yellow">
              <i class="pi pi-clock"></i>
            </div>
            <div class="kpi-body">
              <span class="kpi-value">{{ stats.management?.waitingList?.total ?? '—' }}</span>
              <span class="kpi-label">{{ lang('admin.stats.waitlist_total') }}</span>
            </div>
          </div>

          <div class="kpi-card" :class="{ 'kpi-card--alert': stats.management?.messages?.pending > 0 }">
            <div class="kpi-icon" :class="stats.management?.messages?.pending > 0 ? 'kpi-icon--red' : 'kpi-icon--teal'">
              <i class="pi pi-envelope"></i>
            </div>
            <div class="kpi-body">
              <span class="kpi-value">{{ stats.management?.messages?.pending ?? '—' }}</span>
              <span class="kpi-label">{{ lang('admin.stats.messages_pending') }}</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon--blue">
              <i class="pi pi-list"></i>
            </div>
            <div class="kpi-body">
              <span class="kpi-value">{{ stats.prestataires?.totalPrestations ?? '—' }}</span>
              <span class="kpi-label">{{ lang('admin.stats.total_prestations') }}</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon--green">
              <i class="pi pi-calendar"></i>
            </div>
            <div class="kpi-body">
              <span class="kpi-value">{{ stats.prestataires?.totalActivities ?? '—' }}</span>
              <span class="kpi-label">{{ lang('admin.stats.total_activities') }}</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon--purple">
              <i class="pi pi-ticket"></i>
            </div>
            <div class="kpi-body">
              <span class="kpi-value">{{ stats.prestataires?.totalMaxPlaces ?? '—' }}</span>
              <span class="kpi-label">{{ lang('admin.stats.total_max_places') }}</span>
            </div>
          </div>
        </div>

        <!-- Prestataires par statut + taux occupation stands -->
        <div class="charts-grid-2">
          <div class="chart-card">
            <h4 class="chart-title">{{ lang('admin.stats.providers_by_status') }}</h4>
            <Chart type="doughnut" :data="providersByStatusData" :options="donutOptions" class="chart-medium" />
          </div>

          <div class="chart-card">
            <h4 class="chart-title">{{ lang('admin.stats.stand_occupancy') }}</h4>
            <Chart type="doughnut" :data="standOccupancyData" :options="donutOptions" class="chart-medium" />
          </div>
        </div>
      </section>

      <!-- ===== SECTION PRESTATAIRES ===== -->
      <section class="stats-section">
        <h3 class="section-title">
          <i class="pi pi-briefcase section-icon"></i>
          {{ lang('admin.stats.providers') }}
        </h3>

        <!-- Répartition par catégorie + disponibilités + prestations catégorie -->
        <div class="charts-grid-2">
          <div class="chart-card">
            <h4 class="chart-title">{{ lang('admin.stats.providers_by_category') }}</h4>
            <Chart type="doughnut" :data="categoryData" :options="donutOptions" class="chart-medium" />
          </div>

          <div class="chart-card">
            <h4 class="chart-title">{{ lang('admin.stats.availability_by_day') }}</h4>
            <Chart type="bar" :data="availabilityByDayData" :options="barOptions" class="chart-medium" />
          </div>

          <div class="chart-card">
            <h4 class="chart-title">{{ lang('admin.stats.prestations_by_category') }}</h4>
            <Chart type="bar" :data="prestationsByCategoryData" :options="horizontalBarOptions" class="chart-medium" />
          </div>

          <div class="chart-card">
            <h4 class="chart-title">{{ lang('admin.stats.activities_per_provider') }}</h4>
            <DataTable :value="stats.prestataires?.activitiesPerPrestataire" :paginator="true" :rows="5"
                       responsiveLayout="scroll" class="p-datatable-sm"
                       sortField="activitiesCount" :sortOrder="-1">
              <Column field="name" :header="lang('admin.stats.col_provider')" sortable />
              <Column field="category" :header="lang('prestataire.colCategory')">
                <template #body="slotProps">
                  {{ lang('category.' + slotProps.data.category) }}
                </template>
              </Column>
              <Column field="activitiesCount" :header="lang('admin.stats.col_activities_count')" sortable />
            </DataTable>
          </div>
        </div>

        <!-- Visites par prestataire (simulé) -->
        <div class="chart-card">
          <div class="chart-title-row">
            <h4 class="chart-title">{{ lang('admin.stats.page_views') }}</h4>
            <span class="simulated-badge">
              <i class="pi pi-info-circle"></i>
              {{ lang('admin.stats.simulated_badge') }}
            </span>
          </div>
          <DataTable :value="stats.prestataires?.pageViews" :paginator="true" :rows="8"
                     responsiveLayout="scroll" class="p-datatable-sm"
                     sortField="views" :sortOrder="-1">
            <Column field="name" :header="lang('admin.stats.col_provider')" sortable />
            <Column field="category" :header="lang('prestataire.colCategory')">
              <template #body="slotProps">
                {{ lang('category.' + slotProps.data.category) }}
              </template>
            </Column>
            <Column field="views" :header="lang('admin.stats.col_views')" sortable>
              <template #body="slotProps">
                <div class="progress-bar-container">
                  <div class="progress-bar progress-bar--orange"
                       :style="{ width: Math.min(100, Math.round((slotProps.data.views / maxPageViews) * 100)) + '%' }">
                  </div>
                  <span class="progress-label">{{ slotProps.data.views }}</span>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </section>

      <!-- ===== SECTION VISITEURS ===== -->
      <section class="stats-section">
        <h3 class="section-title">
          <i class="pi pi-users section-icon"></i>
          {{ lang('admin.stats.visitors') }}
        </h3>

        <!-- KPIs Visiteurs -->
        <div class="kpi-grid">
          <div class="kpi-card">
            <div class="kpi-icon kpi-icon--blue">
              <i class="pi pi-eye"></i>
            </div>
            <div class="kpi-body">
              <span class="kpi-value">{{ totalVisitorsAllDays }}</span>
              <span class="kpi-label">{{ lang('admin.stats.total_visitors') }} <span class="simulated-badge simulated-badge--inline"><i class="pi pi-info-circle"></i> {{ lang('admin.stats.simulated_badge') }}</span></span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon--green">
              <i class="pi pi-user"></i>
            </div>
            <div class="kpi-body">
              <span class="kpi-value">{{ stats.visiteurs?.uniqueVisiteurs ?? '—' }}</span>
              <span class="kpi-label">{{ lang('admin.stats.unique_users') }}</span>
            </div>
          </div>

          <div class="kpi-card">
            <div class="kpi-icon kpi-icon--purple">
              <i class="pi pi-calendar-plus"></i>
            </div>
            <div class="kpi-body">
              <span class="kpi-value">{{ totalRegistrations }}</span>
              <span class="kpi-label">{{ lang('admin.stats.activity_registrations') }}</span>
            </div>
          </div>
        </div>

        <!-- Visiteurs par jour (simulé) -->
        <div class="chart-card">
          <div class="chart-title-row">
            <h4 class="chart-title">{{ lang('admin.stats.visitors_per_day') }}</h4>
            <span class="simulated-badge">
              <i class="pi pi-info-circle"></i>
              {{ lang('admin.stats.simulated_badge') }}
            </span>
          </div>
          <Chart type="bar" :data="visitorsPerDayData" :options="barOptions" class="chart-medium" />
        </div>

        <!-- Inscriptions par activité -->
        <div class="chart-card">
          <h4 class="chart-title">{{ lang('admin.stats.activity_registrations_detail') }}</h4>
          <DataTable :value="stats.visiteurs?.activityRegistrations" :paginator="true" :rows="5"
                     responsiveLayout="scroll" class="p-datatable-sm">
            <Column field="title" :header="lang('admin.stats.col_activity')" sortable />
            <Column :header="lang('admin.stats.col_registrations')">
              <template #body="slotProps">
                <div class="progress-bar-container">
                  <div class="progress-bar"
                       :style="{ width: Math.round((slotProps.data.registrations / slotProps.data.maxPlaces) * 100) + '%' }">
                  </div>
                  <span class="progress-label">
                    {{ slotProps.data.registrations }} / {{ slotProps.data.maxPlaces }}
                  </span>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
      </section>

      <!-- ===== SECTION RÉPARTITION (simulée) ===== -->
      <section class="stats-section">
        <h3 class="section-title">
          <i class="pi pi-chart-pie section-icon"></i>
          {{ lang('admin.stats.distribution') }}
          <span class="simulated-badge simulated-badge--title">
            <i class="pi pi-info-circle"></i>
            {{ lang('admin.stats.simulated_badge') }}
          </span>
        </h3>

        <div class="charts-grid-2">
          <div class="chart-card">
            <h4 class="chart-title">{{ lang('admin.stats.age_distribution') }}</h4>
            <Chart type="bar" :data="ageData" :options="horizontalBarOptions" class="chart-medium" />
          </div>

          <div class="chart-card">
            <h4 class="chart-title">{{ lang('admin.stats.gender_distribution') }}</h4>
            <Chart type="doughnut" :data="genderData" :options="donutOptions" class="chart-medium" />
          </div>

          <div class="chart-card">
            <h4 class="chart-title">{{ lang('admin.stats.family_distribution') }}</h4>
            <Chart type="doughnut" :data="familyData" :options="donutOptions" class="chart-medium" />
          </div>

          <div class="chart-card">
            <h4 class="chart-title">{{ lang('admin.stats.geo_distribution') }}</h4>
            <Chart type="bar" :data="geoData" :options="horizontalBarOptions" class="chart-medium" />
          </div>
        </div>
      </section>

      <!-- ===== SECTION SATISFACTION (simulée) ===== -->
      <section class="stats-section">
        <h3 class="section-title">
          <i class="pi pi-star section-icon"></i>
          {{ lang('admin.stats.satisfaction') }}
          <span class="simulated-badge simulated-badge--title">
            <i class="pi pi-info-circle"></i>
            {{ lang('admin.stats.simulated_badge') }}
          </span>
        </h3>

        <div class="satisfaction-layout">
          <div class="satisfaction-score-card">
            <div class="score-ring">
              <svg viewBox="0 0 120 120" class="score-svg">
                <circle cx="60" cy="60" r="50" class="score-bg-circle" />
                <circle cx="60" cy="60" r="50" class="score-fill-circle"
                        :stroke-dasharray="scoreCircle.dash"
                        :stroke-dashoffset="scoreCircle.offset" />
              </svg>
              <div class="score-text">
                <span class="score-number">{{ stats.satisfaction?.score?.toFixed(1) }}</span>
                <span class="score-max">/5</span>
              </div>
            </div>
            <p class="score-label">{{ lang('admin.stats.global_rating') }}</p>
            <div class="star-display">
              <i v-for="n in 5" :key="n"
                 class="pi"
                 :class="n <= Math.round(stats.satisfaction?.score) ? 'pi-star-fill text-yellow' : 'pi-star text-muted'">
              </i>
            </div>
            <p class="score-total">{{ totalSatisfactionVotes }} {{ lang('admin.stats.votes') }}</p>
          </div>

          <div class="chart-card satisfaction-chart">
            <h4 class="chart-title">{{ lang('admin.stats.rating_distribution') }}</h4>
            <div class="rating-bars">
              <div v-for="item in satisfactionSorted" :key="item.stars" class="rating-row">
                <div class="rating-stars">
                  <i v-for="n in item.stars" :key="n" class="pi pi-star-fill text-yellow" style="font-size:0.75rem;"></i>
                </div>
                <div class="rating-progress-wrap">
                  <div class="rating-progress">
                    <div class="rating-bar" :style="{ width: ratingPercent(item.count) + '%' }"></div>
                  </div>
                </div>
                <span class="rating-count">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Chart from 'primevue/chart';
import { DataTable, Column } from 'primevue';
import { useAuthStore } from '@/stores/authStore.js';
import { translations } from '@/datasource/lang.js';

const authStore = useAuthStore();
const lang = (key) => translations[authStore.currentLanguage]?.[key] || key;

const stats = ref({});
const loading = ref(true);
const error = ref(false);

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchStats() {
  loading.value = true;
  error.value = false;
  try {
    const res = await fetch(`${API_BASE}/stats`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    });
    if (!res.ok) throw new Error('Erreur serveur');
    stats.value = await res.json();
  } catch (e) {
    console.error('Erreur chargement stats:', e);
    error.value = true;
  } finally {
    loading.value = false;
  }
}

onMounted(fetchStats);

// --- Computed totaux ---
const totalVisitorsAllDays = computed(() =>
  (stats.value.visiteurs?.totalByDay || []).reduce((sum, d) => sum + d.count, 0)
);

const totalRegistrations = computed(() =>
  (stats.value.visiteurs?.activityRegistrations || []).reduce((sum, a) => sum + a.registrations, 0)
);

const totalSatisfactionVotes = computed(() =>
  (stats.value.satisfaction?.distribution || []).reduce((sum, d) => sum + d.count, 0)
);

const satisfactionSorted = computed(() =>
  [...(stats.value.satisfaction?.distribution || [])].sort((a, b) => b.stars - a.stars)
);

const maxPageViews = computed(() =>
  Math.max(...(stats.value.prestataires?.pageViews || []).map(p => p.views), 1)
);

// --- Score circle SVG ---
const CIRCUMFERENCE = 2 * Math.PI * 50;
const scoreCircle = computed(() => {
  const score = stats.value.satisfaction?.score || 0;
  const pct = score / 5;
  return {
    dash: CIRCUMFERENCE,
    offset: CIRCUMFERENCE * (1 - pct)
  };
});

function ratingPercent(count) {
  const total = totalSatisfactionVotes.value;
  return total > 0 ? Math.round((count / total) * 100) : 0;
}

// --- Palette de couleurs ---
const palette = {
  purple: 'rgba(168, 85, 247, 0.85)',
  green: 'rgba(74, 222, 128, 0.85)',
  blue: 'rgba(96, 165, 250, 0.85)',
  orange: 'rgba(251, 146, 60, 0.85)',
  pink: 'rgba(244, 114, 182, 0.85)',
  teal: 'rgba(45, 212, 191, 0.85)',
  yellow: 'rgba(250, 204, 21, 0.85)',
  red: 'rgba(248, 113, 113, 0.85)',
};

// --- Données graphiques ---
const visitorsPerDayData = computed(() => ({
  labels: (stats.value.visiteurs?.totalByDay || []).map(d => d.day),
  datasets: [{
    label: 'Visiteurs',
    data: (stats.value.visiteurs?.totalByDay || []).map(d => d.count),
    backgroundColor: [palette.blue, palette.purple, palette.green],
    borderRadius: 6,
  }]
}));

const ageData = computed(() => ({
  labels: (stats.value.visiteurs?.ageDistribution || []).map(d => d.label),
  datasets: [{
    label: '%',
    data: (stats.value.visiteurs?.ageDistribution || []).map(d => d.value),
    backgroundColor: [palette.purple, palette.blue, palette.green, palette.orange, palette.pink],
    borderRadius: 4,
  }]
}));

const genderData = computed(() => ({
  labels: (stats.value.visiteurs?.genderDistribution || []).map(d => d.label),
  datasets: [{
    data: (stats.value.visiteurs?.genderDistribution || []).map(d => d.value),
    backgroundColor: [palette.blue, palette.pink, palette.teal],
    borderWidth: 2,
  }]
}));

const familyData = computed(() => ({
  labels: (stats.value.visiteurs?.familyDistribution || []).map(d => d.label),
  datasets: [{
    data: (stats.value.visiteurs?.familyDistribution || []).map(d => d.value),
    backgroundColor: [palette.orange, palette.purple],
    borderWidth: 2,
  }]
}));

const geoData = computed(() => ({
  labels: (stats.value.visiteurs?.geographicDistribution || []).map(d => d.label),
  datasets: [{
    label: '%',
    data: (stats.value.visiteurs?.geographicDistribution || []).map(d => d.value),
    backgroundColor: [palette.green, palette.teal, palette.blue, palette.purple, palette.orange],
    borderRadius: 4,
  }]
}));

const categoryData = computed(() => {
  const byCategory = stats.value.prestataires?.byCategory || {};
  return {
    labels: Object.keys(byCategory).map(k => lang(`category.${k}`)),
    datasets: [{
      data: Object.values(byCategory),
      backgroundColor: [palette.purple, palette.green, palette.blue, palette.orange, palette.pink, palette.teal],
      borderWidth: 2,
    }]
  };
});

const providersByStatusData = computed(() => {
  const s = stats.value.prestataires?.byStatus || {};
  return {
    labels: [lang('admin.stats.status.accepted'), lang('admin.stats.status.pending'), lang('admin.stats.status.refused')],
    datasets: [{
      data: [s.accepted || 0, s.pending || 0, s.refused || 0],
      backgroundColor: [palette.green, palette.yellow, palette.red],
      borderWidth: 2,
    }]
  };
});

const standOccupancyData = computed(() => {
  const occ = stats.value.prestataires?.standOccupancy || {};
  return {
    labels: [lang('admin.stats.stand_used'), lang('admin.stats.stand_empty')],
    datasets: [{
      data: [occ.withProvider || 0, occ.withoutProvider || 0],
      backgroundColor: [palette.teal, palette.red],
      borderWidth: 2,
    }]
  };
});

const availabilityByDayData = computed(() => {
  const days = stats.value.prestataires?.availabilityByDay || {};
  const order = ['vendredi', 'samedi', 'dimanche'];
  const labels = { vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche' };
  return {
    labels: order.map(d => labels[d]),
    datasets: [{
      label: 'Prestataires',
      data: order.map(d => days[d] || 0),
      backgroundColor: [palette.blue, palette.purple, palette.green],
      borderRadius: 6,
    }]
  };
});

const prestationsByCategoryData = computed(() => {
  const byCategory = stats.value.prestataires?.prestationsByCategory || {};
  return {
    labels: Object.keys(byCategory).map(k => lang(`category.${k}`)),
    datasets: [{
      label: 'Prestations',
      data: Object.values(byCategory),
      backgroundColor: [palette.purple, palette.green, palette.blue, palette.orange, palette.pink, palette.teal],
      borderRadius: 4,
    }]
  };
});

// --- Options Chart.js communes ---
const chartDefaults = {
  plugins: {
    legend: { labels: { color: '#c4c4d4', font: { family: 'Rajdhani', size: 13 } } }
  },
  scales: {
    x: { ticks: { color: '#9a9ab0' }, grid: { color: 'rgba(255,255,255,0.05)' } },
    y: { ticks: { color: '#9a9ab0' }, grid: { color: 'rgba(255,255,255,0.08)' } }
  }
};

const barOptions = {
  ...chartDefaults,
  responsive: true,
  maintainAspectRatio: false,
};

const horizontalBarOptions = {
  ...chartDefaults,
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
};

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right', labels: { color: '#c4c4d4', font: { family: 'Rajdhani', size: 13 } } }
  }
};
</script>

<style scoped>
.stats-view {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* En-tête */
.stats-header {
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--glass-border);
}
.stats-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
}
.stats-subtitle {
  margin: 0;
  font-size: 0.9rem;
}
.text-muted { color: var(--necro-text-muted); }
.text-green { color: var(--necro-green); }
.text-purple { color: var(--necro-purple); }
.text-yellow { color: #facc15; }
.text-warning { color: #f59e0b; }

/* Section */
.stats-section {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.section-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--necro-purple);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(168, 85, 247, 0.25);
}
.section-icon { font-size: 1.1rem; }

/* Simulated badge */
.simulated-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #fb923c;
  background: rgba(251, 146, 60, 0.12);
  border: 1px solid rgba(251, 146, 60, 0.3);
  border-radius: 20px;
  padding: 0.15rem 0.55rem;
}
.simulated-badge--title {
  font-size: 0.65rem;
  margin-left: 0.5rem;
}
.simulated-badge--inline {
  font-size: 0.65rem;
  vertical-align: middle;
}

.chart-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.chart-title-row .chart-title {
  margin: 0;
}

/* KPI cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}
.kpi-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md, 10px);
  padding: 1.25rem 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
}
.kpi-card--alert {
  border-color: rgba(251, 146, 60, 0.4);
  background: rgba(251, 146, 60, 0.05);
}
.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  flex-shrink: 0;
}
.kpi-icon--blue   { background: rgba(96, 165, 250, 0.18); color: #60a5fa; }
.kpi-icon--green  { background: rgba(74, 222, 128, 0.18); color: #4ade80; }
.kpi-icon--purple { background: rgba(168, 85, 247, 0.18); color: #a855f7; }
.kpi-icon--orange { background: rgba(251, 146, 60, 0.18); color: #fb923c; }
.kpi-icon--teal   { background: rgba(45, 212, 191, 0.18); color: #2dd4bf; }
.kpi-icon--pink   { background: rgba(244, 114, 182, 0.18); color: #f472b6; }
.kpi-icon--yellow { background: rgba(250, 204, 21, 0.18); color: #facc15; }
.kpi-icon--red    { background: rgba(248, 113, 113, 0.18); color: #f87171; }

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.kpi-value {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--necro-text, #484848);
  line-height: 1;
}
.kpi-label {
  font-size: 0.78rem;
  color: var(--necro-text-muted, #888);
  line-height: 1.3;
}

/* Chart card */
.chart-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md, 10px);
  padding: 1.25rem 1.5rem;
}
.chart-title {
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--necro-text-muted, #888);
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chart-medium {
  height: 250px;
}

.charts-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1.25rem;
}

/* Progress bars */
.progress-bar-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  height: 22px;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #a855f7, #60a5fa);
  border-radius: 4px;
  min-width: 4px;
  transition: width 0.4s ease;
}
.progress-bar--orange {
  background: linear-gradient(90deg, #fb923c, #facc15);
}
.progress-label {
  font-size: 0.8rem;
  color: var(--necro-text-muted);
  white-space: nowrap;
  position: absolute;
  left: calc(100% + 0.3rem);
  font-family: 'Rajdhani', sans-serif;
  font-weight: 600;
}

/* Satisfaction */
.satisfaction-layout {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  flex-wrap: wrap;
}
.satisfaction-score-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md, 10px);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  min-width: 200px;
}
.score-ring {
  position: relative;
  width: 120px;
  height: 120px;
}
.score-svg {
  width: 120px;
  height: 120px;
  transform: rotate(-90deg);
}
.score-bg-circle {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 10;
}
.score-fill-circle {
  fill: none;
  stroke: #a855f7;
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s ease;
}
.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  align-items: baseline;
  gap: 2px;
}
.score-number {
  font-family: 'Rajdhani', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: var(--necro-text, #3a3a3a);
}
.score-max {
  font-size: 0.85rem;
  color: var(--necro-text-muted);
}
.score-label {
  font-size: 0.8rem;
  color: var(--necro-text-muted);
  margin: 0;
}
.star-display { display: flex; gap: 4px; font-size: 1rem; }
.score-total { font-size: 0.75rem; color: var(--necro-text-muted); margin: 0; }

.satisfaction-chart {
  flex: 1;
  min-width: 280px;
}
.rating-bars {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.rating-stars {
  display: flex;
  gap: 2px;
  width: 80px;
  flex-shrink: 0;
}
.rating-progress-wrap {
  flex: 1;
}
.rating-progress {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  height: 12px;
  overflow: hidden;
}
.rating-bar {
  height: 100%;
  background: linear-gradient(90deg, #facc15, #a855f7);
  border-radius: 4px;
  transition: width 0.5s ease;
}
.rating-count {
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--necro-text-muted);
  width: 32px;
  text-align: right;
  flex-shrink: 0;
}

/* Loading / error states */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 4rem;
  color: var(--necro-text-muted);
  font-family: 'Rajdhani', sans-serif;
  font-size: 1rem;
}

/* DataTable overrides */
:deep(.p-datatable-thead > tr > th) {
  background: rgba(0, 0, 0, 0.2) !important;
  color: var(--necro-text-muted) !important;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-color: var(--glass-border) !important;
}
:deep(.p-datatable-tbody > tr) {
  background: transparent !important;
  color: var(--necro-text, #e0e0f0) !important;
  border-color: var(--glass-border) !important;
  font-family: 'Rajdhani', sans-serif;
  font-size: 0.95rem;
  transition: background 0.15s;
}
:deep(.p-datatable-tbody > tr:hover) {
  background: rgba(168, 85, 247, 0.07) !important;
}
:deep(.p-paginator) {
  background: transparent !important;
  color: var(--necro-text-muted) !important;
}
</style>
