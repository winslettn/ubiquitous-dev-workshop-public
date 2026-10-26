#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"

find_python() {
    if command -v python3 >/dev/null 2>&1; then
        command -v python3
    elif command -v python >/dev/null 2>&1; then
        command -v python
    else
        echo "Python 3.12+ is required but was not found on PATH." >&2
        return 1
    fi
}

resolve_venv_python() {
    if [[ -x "${PROJECT_ROOT}/.venv/bin/python" ]]; then
        printf '%s\n' "${PROJECT_ROOT}/.venv/bin/python"
    elif [[ -x "${PROJECT_ROOT}/.venv/Scripts/python.exe" ]]; then
        printf '%s\n' "${PROJECT_ROOT}/.venv/Scripts/python.exe"
    fi
}

VENV_PYTHON="$(resolve_venv_python || true)"

if [[ -z "${VENV_PYTHON}" ]]; then
    PYTHON="$(find_python)"
    "${PYTHON}" -m venv "${PROJECT_ROOT}/.venv"
    VENV_PYTHON="$(resolve_venv_python)"
fi

cd "${PROJECT_ROOT}"
"${VENV_PYTHON}" -m pip install --upgrade pip --quiet
"${VENV_PYTHON}" -m pip install -e ".[dev]" --quiet

export PROJECT_ROOT
export VENV_PYTHON
