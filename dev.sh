#!/bin/bash

# dev.sh - Démarre le frontend et le backend simultanément
# Utilisation : ./dev.sh

# Fonction pour tout arrêter proprement lors d'un Ctrl+C
cleanup() {
    echo -e "\n Arrêt des serveurs..."
    # Tue tous les processus fils du script (le backend et le frontend)
    kill $(jobs -p) 2>/dev/null
    exit
}

# Intercepter le signal d'interruption (Ctrl+C)
trap cleanup SIGINT

echo "Démarrage du Backend (port 3000)..."
(cd backend && npm run dev) &

# Attendre un peu que le backend commence à se lancer
sleep 2

echo "Démarrage du Frontend (port 5173)..."
npm run dev
