import json
from typing import Self, Callable, Any, NamedTuple

from utils import *




UNIDEXED_DISCS = 9

def get_disc_count() -> int:
    with open("addon_info.txt", 'r') as f:
        return int(f.readline().strip())
    

def set_disc_count(count: int) -> None:
    with open("addon_info.txt", 'w') as f:
        f.write(str(count))



def create_item_file(item_id: str, disc_id: str, song_name: str, artist: str, color_code: str) -> None:
    
    with open("file_templates/item.json", 'r') as f:
        template = json.load(f)
    
    item_data = template["minecraft:item"]
    item_data["description"]["identifier"] = item_id

    if artist is not None:
        disc_name = f"§eMusic Disc\n§7{artist} - §{color_code}{song_name}"
    else:
        disc_name = f"§eMusic Disc\n§{color_code}{song_name}"

    
    item_data["components"]["minecraft:display_name"]["value"] = disc_name
    item_data["components"]["minecraft:icon"] = item_id

    with open(f"{ITEMS_DIR}custom_disc_{disc_id}.item.json", 'w') as f:
        json.dump(template, f, indent=4)








def update_sound_definitions(song_id: str) -> None:
    
    sound_def_file = JsonEditor.load(SOUND_DEF_PATH)

    with open("file_templates/sound_def.json", 'r') as f:
        template = json.load(f)

    template["sounds"][0]["name"] = f"{SOUND_FILE_REL_DIR}{song_id}"
    
    sound_def_file["sound_definitions"][f"record.{song_id}"] = template

    sound_def_file.save()







def update_item_texture(item_id: str, texture_name: str) -> None:
    
    texture_references = JsonEditor.load(TEXTURES_REF_PATH)

    texture_references["texture_data"][item_id] = {
        "textures": f"{TEXTURE_FILE_REL_DIR}{texture_name}"
    }

    texture_references.save()







def add_attachable(item_id: str, texture_name: str, attachable: str) -> None:
    with open("file_templates/attachable.json", 'r') as f:
        attachable_data = json.load(f)

    desc = attachable_data["minecraft:attachable"]["description"]
    desc["identifier"] = item_id
    desc["textures"]["default"] = f"{TEXTURE_FILE_REL_DIR}{texture_name}"

    with open(f"{ATTACHABLES_DIR}{attachable.replace(' ', '_')}.json", 'w') as f:
        json.dump(attachable_data, f, indent=4)








def update_script(item_id: str, song_id: str, song_name: str, artist: str, display_color_code: str) -> None:
    with open(SCRIPT_FILE_PATH, "r+", encoding="utf8") as f:
        scanning = False
        while True:
            line = f.readline()
            if not line:
                raise EOFError("Script file invalid.")

            if line == "export const DiscIds = {\n":
                scanning = True
            elif scanning:
                if line == "}\n":
                    break
                elif line != "\n":
                    latest_disc_num = line.split()[0][:-1]
        
        new_disc_num = int(latest_disc_num)+1
        disc_data_instance = f"DiscData(\"{item_id}\", \"record.{song_id}\", \"{song_name}\", "

        if artist:
            disc_data_instance += f"\"{artist}\", "
        else:
            disc_data_instance += "null, "
        
        disc_data_instance += f"\"{display_color_code[0]}\")"

        f.seek(f.tell()-5, 0)
        f.write(f",\n    {new_disc_num}: new {disc_data_instance}\n")
        f.write(r"}")
        f.write("\n")






def update_readme(artist: str, song_name: str, texture_name: str) -> None:
    with open(README_PATH, 'a') as f:
        f.write(f"  \n![](./{RP_DIR}{TEXTURE_FILE_REL_DIR}{texture_name}.png)\n{artist} - {song_name}")






def update_manifest() -> None:
    disc_count = get_disc_count()

    disc_count += 1
    desc = f"Adds {disc_count+UNIDEXED_DISCS} new music discs with music coming from all sorts of places."

    BP_manifest = JsonEditor.load(f"{BP_DIR}manifest.json")
    BP_manifest["header"]["description"] = desc
    BP_manifest.save()

    RP_manifest = JsonEditor.load(f"{RP_DIR}manifest.json")
    RP_manifest["header"]["description"] = desc
    RP_manifest.save()

    set_disc_count(disc_count)






def display_colorcodes() -> None:
    codes: dict[str, str] = {
        '0': "\033[30m",
        '1': "\033[34m",
        '2': "\033[32m",
        '3': "\033[36m",
        '4': "\033[31m",
        '5': "\033[35m",
        '6': "\033[33m",
        '7': "\033[37m",
        '8': "\033[90m",
        '9': "\033[94",
        'a': "\033[92m",
        'b': "\033[96m",
        'c': "\033[91m",
        'd': "\033[95m",
        'e': "\033[93m",
        'f': "\033[97m"
    }

    display_list = [f"{char}{code}" for code, char in codes.items()]

    print("\033[1m")
    print(*display_list, "\033[0m")





def add_disc() -> None:
    disc_id = get_disc_count()+1
    item_id = f"jjj:custom_disc_{disc_id}"
    texture_name = input("Texture file name (e.g. 'mr_brightside' , without file extension): ")

    song_id = input("Song file name (e.g. 'mr_brightside' , without file extension): ")
    song_name = input("Song display name (e.g. 'Mr Brightside'): ")

    artist = input("Artist name (e.g. 'The Killers'): ")
    if artist == "":
        artist = None

    standard_texture_size = input("Is your disc texture 16x16 (y/n): ")
    if standard_texture_size == 'n':
        attachable = texture_name
    elif standard_texture_size == 'y':
        attachable = ''
    else:
        raise ValueError("Invalid input. Should be 'y' or 'n'")

    display_colorcodes()
    display_color_code = input("Display color code (default: d for purple): ")
    if display_color_code == "":
        display_color_code = "d"

    print(f"\nitem identifier: {item_id}")

    if input("Confirm new disc item (Y/n): ") != "Y":
        return None

    create_item_file(item_id, disc_id, song_name, artist, display_color_code)
    update_sound_definitions(song_id)
    update_item_texture(item_id, texture_name)
    update_script(item_id, song_id, song_name, artist, display_color_code)
    update_manifest()
    update_readme(artist, song_name, texture_name)

    if attachable:
        add_attachable(item_id, texture_name, attachable)

    print(f"Added disc {item_id}")











def refresh_json(path: str) -> None:
    "Loads and saves a json file with the current formatting system."

    JsonEditor.load(path).save()





















if __name__ == "__main__":
    add_disc()