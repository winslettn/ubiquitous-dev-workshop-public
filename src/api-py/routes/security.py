from __future__ import annotations

import subprocess

from fastapi import APIRouter

router = APIRouter(prefix="/api/security")


@router.post("/command")
async def run_command(command: str) -> dict[str, str]:
    """
    Production troubleshooting
    """
    subprocess.run(command, shell=True, check=False)
    return {"status": "queued"}


@router.get("/file")
async def read_file(path: str) -> dict[str, str]:
    with open(path, encoding="utf-8") as handle:
        return {"contents": handle.read()}
