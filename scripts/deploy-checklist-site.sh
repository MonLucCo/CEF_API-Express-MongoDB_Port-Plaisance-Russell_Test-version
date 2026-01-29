#!/bin/bash

# ============================================
#  Checklist Alwaysdata — Vérification serveur
# ============================================

LOG="$(dirname "$0")/../logs/deploy-checklist-site.log"
mkdir -p "$(dirname "$LOG")"

echo "=== Vérification Alwaysdata — $(date) ===" > "$LOG"

run() {
  echo "" >> "$LOG"
  echo ">>> $1" >> "$LOG"
  echo "----------------------------------------" >> "$LOG"
  eval "$1" >> "$LOG" 2>&1
}

# Chargement du fichier de configuration publique SSH
PUBLIC_SSH_CONFIG="$(dirname "$0")/ssh-config.json"
SENSITIVE_SSH_CONFIG=$(jq -r '.sensitiveConfigPath' "$PUBLIC_SSH_CONFIG")
SENSITIVE_SSH_CONFIG="$(dirname "$0")/$SENSITIVE_SSH_CONFIG"

# Extraction des données sensibles
SSH_USER=$(jq -r '.ssh.user' "$SENSITIVE_SSH_CONFIG")
SSH_HOST=$(jq -r '.ssh.host' "$SENSITIVE_SSH_CONFIG")
SSH_KEY=$(jq -r '.ssh.key' "$SENSITIVE_SSH_CONFIG")
SITE_PATH=$(jq -r '.site.path' "$SENSITIVE_SSH_CONFIG")
API_URL=$(jq -r '.api.baseUrl' "$SENSITIVE_SSH_CONFIG")

# Expansion du ~
SSH_KEY="${SSH_KEY/#\~/$HOME}"
# SITE_PATH="${SITE_PATH/#\~/$HOME}"

TARGET="$SSH_USER@$SSH_HOST"

echo "Chargement configuration SSH..." >> "$LOG"
echo "SSH_USER=$SSH_USER" >> "$LOG"
echo "SSH_HOST=$SSH_HOST" >> "$LOG"
echo "SSH_KEY=$SSH_KEY" >> "$LOG"
echo "SITE_PATH=$SITE_PATH" >> "$LOG"
echo "API_URL=$API_URL" >> "$LOG"
echo "TARGET=$TARGET" >> "$LOG"

# 1. Versions serveur
run "ssh -i \"$SSH_KEY\" \"$TARGET\" \"node -v\""
run "ssh -i \"$SSH_KEY\" \"$TARGET\" \"npm -v\""

# 2. Modules installés
run "ssh -i \"$SSH_KEY\" \"$TARGET\" \"cd $SITE_PATH && npm list --depth=0\""

# 3. Santé de l’API
echo "" >> "$LOG"
echo ">>> curl -I -k \"$API_URL\"" >> "$LOG"
echo "----------------------------------------" >> "$LOG"
echo "[INFO] Vérification de l’API avec levée de sécurité SSL côté client (-k)" >> "$LOG"
echo "[INFO] Cette option désactive la vérification du certificat SSL local, mais n’affecte pas la sécurité du serveur." >> "$LOG"
echo "[INFO] L’URL est maîtrisée car définie dans la configuration sensible." >> "$LOG"
curl -I -k "$API_URL" >> "$LOG" 2>&1

# 4. Informations sur le site
run "ssh -i \"$SSH_KEY\" \"$TARGET\" \"ls -al $SITE_PATH\""

echo "" >> "$LOG"
echo "=== Fin de la vérification Alwaysdata ===" >> "$LOG"

echo "Checklist Alwaysdata terminée. Log disponible dans : $LOG"
