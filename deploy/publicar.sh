#!/usr/bin/env bash
# Builda a imagem do portfólio aqui, envia para a VPS e troca a que está no ar.
#
#   deploy/publicar.sh             build + envio + troca
#   deploy/publicar.sh --dominio   também liga o bloco do Caddy (só com o DNS
#                                  de rodrigoscharp.com já apontado para a VPS)
#
# VPS_SSH pode trocar o destino (padrão: root@189.24.7.165 com a chave campo_hostinger).
set -euo pipefail
cd "$(dirname "$0")/.."
VPS=${VPS_SSH:-root@189.24.7.165}
SSH=(ssh -i "$HOME/.ssh/campo_hostinger" -o IdentitiesOnly=yes "$VPS")
TAG=portfolio:$(git rev-parse --short HEAD)

docker buildx build --platform linux/amd64 -t "$TAG" --load web
docker save "$TAG" | gzip | "${SSH[@]}" 'gunzip | docker load'
"${SSH[@]}" 'install -d /opt/portfolio'
scp -q -i "$HOME/.ssh/campo_hostinger" -o IdentitiesOnly=yes \
  deploy/docker-compose.yml deploy/portfolio.caddy "$VPS:/opt/portfolio/"

"${SSH[@]}" bash -s -- "$TAG" "${1:-}" <<'REMOTO'
set -euo pipefail
cd /opt/portfolio
docker network inspect borda >/dev/null 2>&1 || docker network create borda >/dev/null
[[ -s .imagem ]] && cp .imagem .imagem-anterior
docker tag "$1" portfolio:atual
docker compose up -d --remove-orphans
for _ in $(seq 1 30); do
  s=$(docker inspect -f '{{.State.Health.Status}}' "$(docker compose ps -q portfolio)")
  [[ "$s" == healthy ]] && break
  sleep 2
done
[[ "$s" == healthy ]] || { docker compose logs --tail 60 portfolio; exit 1; }
echo "$1" > .imagem
if [[ "${2:-}" == "--dominio" ]]; then
  cp portfolio.caddy /opt/borda/sites/portfolio.caddy
  docker exec muno-caddy-1 caddy reload --config /etc/caddy/Caddyfile >/dev/null
  echo "[portfolio] domínio ligado no Caddy"
fi
echo "[portfolio] no ar: $1"
REMOTO
