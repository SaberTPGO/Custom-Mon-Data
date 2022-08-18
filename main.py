import json

with open("mons.csv") as f:
    mons = [i.split(",") for i in f.read().split("\n")]

newMons = {}
for mon in mons:
    newMons[mon[1].lower()] = {
        "name": mon[1],
        "types": [mon[2], mon[3]],
        "baseStats": {
            'hp': int(mon[7] or "0") or mon[7],
            "atk": int(mon[8] or "0") or mon[8],
            "def": int(mon[9] or "0") or mon[9],
            "spa": int(mon[10] or "0") or mon[10],
            "spd": int(mon[11] or "0") or mon[11],
            "spe": int(mon[12] or "0") or mon[12]
        },
        "abilities": {
            0: mon[4],
            1: mon[5] or "",
            "H": mon[6] or ""
        }
    }
    
with open("final.json", "w") as f:
    json.dump(newMons, f, indent=4)