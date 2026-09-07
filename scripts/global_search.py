import os
import sys

VAULT_DIR = os.path.expanduser("~/storage/shared/Documents/ObsidianVault")
os.chdir(VAULT_DIR)

query = sys.argv[1] if len(sys.argv) > 1 else "DARKGHOST"
print(f"Executing global search across vault for query: '{query}'\n")

match_count = 0
skip_dirs = {".git", "node_modules", "bridge_cache"}
skip_exts = {".png", ".jpg", ".jpeg", ".pdf", ".zip", ".tar", ".gz", ".wav", ".mp3"}

for root, dirs, files in os.walk("."):
    dirs[:] = [d for d in dirs if d not in skip_dirs and not d.startswith(".")]
    for file in files:
        ext = os.path.splitext(file)[1].lower()
        if ext in skip_exts:
            continue
        
        filepath = os.path.join(root, file)
        try:
            with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                lines = f.readlines()
            
            for idx, line in enumerate(lines, 1):
                if query.lower() in line.lower():
                    match_count += 1
                    print(f"[{filepath}:{idx}] {line.strip()}")
        except Exception as e:
            pass

print(f"\nSearch complete. Found {match_count} matches for '{query}'.")
