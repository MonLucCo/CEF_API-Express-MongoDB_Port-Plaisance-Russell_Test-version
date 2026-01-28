#!/bin/bash

# Chargement du fichier de configuration publique
PUBLIC_CONFIG="$(dirname "$0")/ssh-config.json"
SENSITIVE_CONFIG=$(jq -r '.sensitiveConfigPath' "$PUBLIC_CONFIG")

# Résolution du chemin absolu
SENSITIVE_CONFIG="$(dirname "$0")/$SENSITIVE_CONFIG"

# Chargement des données sensibles
SSH_USER=$(jq -r '.ssh.user' "$SENSITIVE_CONFIG")
SSH_HOST=$(jq -r '.ssh.host' "$SENSITIVE_CONFIG")
SSH_KEY=$(jq -r '.ssh.key' "$SENSITIVE_CONFIG")

echo "Connexion SSH à $SSH_USER@$SSH_HOST ..."
ssh -i "$SSH_KEY" "$SSH_USER@$SSH_HOST"
