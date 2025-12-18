#!/bin/bash

# =========================
# Configuration
# =========================
VM2_IP="192.168.10.20"          # <-- replace with VM2 IP
VM2_USER="vm2"                # <-- SSH user on VM2
LOG_FILE="/var/log/system_activity.log"

# =========================
# Variables
# =========================
DATE=$(date -u +"%Y-%m-%d %H:%M:%S UTC")
HOSTNAME=$(hostname)
VM1_IP=$(hostname -I | awk '{print $1}')

# =========================
# Input
# =========================
if [ -z "$1" ]; then
  read -p "Enter log message: " MESSAGE
else
  MESSAGE="$1"
fi

# =========================
# Logging
# =========================
echo "Logging to VM2 ($VM2_IP)..."

ssh ${VM2_USER}@${VM2_IP} \
  "echo \"$DATE | $HOSTNAME ($VM1_IP) | $MESSAGE\" >> $LOG_FILE"

echo "Done!"


