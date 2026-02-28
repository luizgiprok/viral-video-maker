#!/bin/bash

# Script para iniciar o servidor Vite para rede interna
cd /home/claw/.openclaw/workspace/viral-video-maker/client

echo "Iniciando servidor Vite para rede interna..."
echo "Host: 0.0.0.0"
echo "Port: 3000"

# Iniciar servidor com host 0.0.0.0
HOST=0.0.0.0 npm run dev