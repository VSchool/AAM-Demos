#!/bin/bash
set -e
cd "$(dirname "$0")"
mkdir -p _site/AAM-Demos
for v in v0 v1 v2 v3 v4 v5 v6; do
  d="demos/expo-habit-tracker-$v"
  echo ""
  echo "=== [$(date +%H:%M:%S)] Building expo-habit-tracker-$v ==="
  ( cd "$d" && npm ci --silent --no-audit --no-fund && npx expo export -p web ) || { echo "FAIL: $v"; exit 1; }
  rm -rf "_site/AAM-Demos/expo-habit-tracker-$v"
  cp -r "$d/dist" "_site/AAM-Demos/expo-habit-tracker-$v"
  echo "=== [$(date +%H:%M:%S)] Done $v ==="
done
echo ""
echo "ALL 7 BUILT $(date +%H:%M:%S)"
ls -la _site/AAM-Demos/
