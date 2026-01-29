#!/bin/bash

# Chargement du fichier de configuration publique SSH
PUBLIC_SSH_CONFIG="$(dirname "$0")/ssh-config.json"
SENSITIVE_SSH_CONFIG=$(jq -r '.sensitiveConfigPath' "$PUBLIC_SSH_CONFIG")

# Résolution du chemin absolu
SENSITIVE_SSH_CONFIG="$(dirname "$0")/$SENSITIVE_SSH_CONFIG"

# Extraction des données sensibles
SSH_USER=$(jq -r '.ssh.user' "$SENSITIVE_SSH_CONFIG")
SSH_HOST=$(jq -r '.ssh.host' "$SENSITIVE_SSH_CONFIG")
SSH_KEY=$(jq -r '.ssh.key' "$SENSITIVE_SSH_CONFIG")

# Expansion du ~
SSH_KEY="${SSH_KEY/#\~/$HOME}"

echo "Connexion SSH à $SSH_USER@$SSH_HOST ..."
ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST"
