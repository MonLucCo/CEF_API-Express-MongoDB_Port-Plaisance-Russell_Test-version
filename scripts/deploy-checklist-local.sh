#!/bin/bash

# ============================================
#  Checklist locale — Vérification du projet
# ============================================

# Initialisation du log
LOG="$(dirname "$0")/../logs/deploy-checklist-local.log"
mkdir -p "$(dirname "$LOG")"

echo "=== Vérification locale — $(date) ===" > "$LOG"

run() {
  echo "" >> "$LOG"
  echo ">>> $1" >> "$LOG"
  echo "----------------------------------------" >> "$LOG"
  eval "$1" >> "$LOG" 2>&1
}

# 1. Versions locales
run "node -v"
run "npm -v"

# 2. Modules installés
run "npm list --depth=0"

# 3. Scripts de déploiement
run "npm run deploy:help"
run "npm run deploy:dry"

echo "" >> "$LOG"
echo "=== Fin de la vérification locale ===" >> "$LOG"

echo "Checklist locale terminée. Log disponible dans : $LOG"
