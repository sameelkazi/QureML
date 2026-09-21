import sys
import os
from pathlib import Path

# Ensure stdlib 'platform' is imported and cached in sys.modules first to avoid collision with ./platform directory
_root = str(Path(__file__).resolve().parent)
_removed = False
if sys.path and (sys.path[0] in ("", ".") or os.path.abspath(sys.path[0]) == os.path.abspath(_root)):
    _first = sys.path.pop(0)
    _removed = True

import platform

if _removed:
    sys.path.insert(0, _first)

# Add platform/backend to sys.path so 'main' can be imported directly
backend_dir = Path(__file__).resolve().parent / "platform" / "backend"
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from main import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
