#!/usr/bin/env bash
set -euo pipefail

for i in {1..100}; do
  echo "=== Continue pass $i ==="

  codex exec resume --last \
    "Continue from where we left off. Make the next useful change in current or next roadmap."

  git diff --stat
done