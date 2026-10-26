#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
source "${SCRIPT_DIR}/ensure-env.sh"

cd "${PROJECT_ROOT}"
"${VENV_PYTHON}" -m pytest
