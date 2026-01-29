#!/bin/bash

# ============================================
#  Script de déploiement vers Alwaysdata (v6)
# ============================================

# Chargement du fichier de configuration publique
PUBLIC_CONFIG="$(dirname "$0")/deploy-config.json"
SENSITIVE_CONFIG=$(jq -r '.sensitiveConfigPath' "$PUBLIC_CONFIG")

# Résolution du chemin absolu
SENSITIVE_CONFIG="$(dirname "$0")/$SENSITIVE_CONFIG"

# Extraction des variables de configuration
SSH_USER=$(jq -r '.deploy.sshUser' "$SENSITIVE_CONFIG")
SSH_HOST=$(jq -r '.deploy.sshHost' "$SENSITIVE_CONFIG")
SSH_KEY=$(jq -r '.deploy.sshKey' "$SENSITIVE_CONFIG")
REMOTE_DIR=$(jq -r '.deploy.remotePath' "$SENSITIVE_CONFIG")

TARGET="$SSH_USER@$SSH_HOST:$REMOTE_DIR"
SSH_KEY="${SSH_KEY/#\~/$HOME}"

# Fichiers et dossiers utilisés
LOG_FILE="./logs/deploy.log"
RSYNC_FILTER_FILE="scripts/.rsync-filter.rules"
PREVIEW_DIR="./scripts/__preview__"

# Options rsync avec filtrage externe
RSYNC_OPTIONS=(-avz --delete --progress --filter="merge $RSYNC_FILTER_FILE")

# Création du dossier de logs s'il n'existe pas
mkdir -p logs

log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') — $1" | tee -a "$LOG_FILE"
}

# ============================================
#  Vérification de la clé SSH
# ============================================
if [ ! -f "$SSH_KEY" ]; then
  log "ERREUR : clé SSH introuvable à $SSH_KEY"
  exit 1
fi

# ============================================
#  Vérification du fichier de filtrage
# ============================================
if [ ! -f "$RSYNC_FILTER_FILE" ]; then
  log "ERREUR : fichier de filtrage $RSYNC_FILTER_FILE introuvable"
  exit 1
fi

# ============================================
#  Option : --help
# ============================================
if [[ "$1" == "--help" || "$1" == "-h" ]]; then
  echo ""
  echo "Usage : deploy.sh [option]"
  echo ""
  echo "Options disponibles :"
  echo "  --dry-run        Simulation du déploiement"
  echo "  --sync-preview   Aperçu des fichiers transférés (via .rsync-filter)"
  echo "  --check          Test de connexion SSH"
  echo "  --help, -h       Affiche cette aide"
  echo ""
  echo "Filtrage utilisé : fichier .rsync-filter.rules situé dans scripts/"
  echo ""
  echo "Note : le redémarrage du site Alwaysdata doit être effectué manuellement."
  echo ""
  exit 0
fi

# ============================================
#  Option : --check
# ============================================
if [ "$1" == "--check" ]; then
  log "Test de connexion SSH vers $SSH_USER@$SSH_HOST"
  ssh -i "$SSH_KEY" -o BatchMode=yes "$SSH_USER@$SSH_HOST" "echo 'Connexion OK'" || {
    log "ERREUR : échec de connexion SSH"
    exit 1
  }
  exit 0
fi

# ============================================
#  Option : --restart
# ============================================
if [ "$1" == "--restart" ]; then
  echo "Redémarrage du site doit être effectué manuellement via l'interface d'administration."
  exit 0
fi

# ============================================
#  Option : --dry-run
# ============================================
if [ "$1" == "--dry-run" ]; then
  log "Simulation (dry-run) du déploiement selon $RSYNC_FILTER_FILE"
  rsync -e "ssh -i $SSH_KEY" "${RSYNC_OPTIONS[@]}" --dry-run ./ "$TARGET" || {
    log "ERREUR : échec du rsync (dry-run)"
    exit 1
  }
  log "Simulation terminée"
  exit 0
fi

# ============================================
#  Option : --sync-preview
# ============================================
if [ "$1" == "--sync-preview" ]; then
  log "Aperçu (sync-preview) des fichiers transférés selon $RSYNC_FILTER_FILE"
  rsync "${RSYNC_OPTIONS[@]}" --dry-run ./ "$PREVIEW_DIR" || {
    log "ERREUR : échec du rsync (preview)"
    exit 1
  }
  log "Aperçu terminé"
  exit 0
fi

# ============================================
#  Déploiement réel
# ============================================
read -p "Confirmer le déploiement vers Alwaysdata (Y/n) : " confirm
if [[ "$confirm" != "Y" && "$confirm" != "y" ]]; then
  log "Déploiement annulé"
  exit 0
fi

log "Déploiement en cours..."
rsync -e "ssh -i $SSH_KEY" "${RSYNC_OPTIONS[@]}" ./ "$TARGET" || {
  log "ERREUR : échec du rsync"
  exit 1
}
log "Synchronisation terminée"

log "Installation des dépendances sur le serveur..."
ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST" "cd $REMOTE_DIR && npm install --omit=dev" || {
  log "ERREUR : échec de npm install sur le serveur"
  exit 1
}

log "Déploiement complet — redémarrage manuel nécessaire via l’interface Alwaysdata"
exit 0
