import os, json

from utils import ITEMS_DIR, JsonEditor



if __name__ == "__main__":
    for item_name in os.listdir(ITEMS_DIR[0:-1]):
        json_file = JsonEditor.load(f"{ITEMS_DIR}{item_name}")
        json_file["format_version"] = "1.20.100"
        print(json_file["minecraft:item"]["components"]["minecraft:display_name"]["value"])
        json_file.save()
        break