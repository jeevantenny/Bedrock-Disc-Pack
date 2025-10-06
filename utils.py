import shutil
from typing import Self, Callable, NamedTuple, Any
import json




BP_DIR = "jjj_disc_pack_BP/"
RP_DIR = "jjj_disc_pack_RP/"


ITEMS_DIR = f"{BP_DIR}items/jjj_custom_discs/"

SCRIPT_FILE_PATH = f"{BP_DIR}scripts/music_discs.js"

SOUND_DEF_PATH = f"{RP_DIR}sounds/sound_definitions.json"
SOUND_FILE_REL_DIR = "sounds/music/game/records/"

TEXTURES_REF_PATH = f"{RP_DIR}textures/item_texture.json"
TEXTURE_FILE_REL_DIR = "textures/items/jjj_custom_discs/"

ATTACHABLES_DIR = f"{RP_DIR}attachables/"

README_PATH = "README.md"


ADDON_INFO_PATH = "things_for_script/addon_info.txt"




def add_disc(item_id: str,
             disc_id: int,
             texture_name: str,
             song_id: str,
             song_name: str,
             artist: str,
             display_color_code: str,
             attachable: str = "",
             _update_readme=True):

    create_item_file(item_id, disc_id, song_name, artist, display_color_code)
    update_sound_definitions(song_id)
    update_item_texture(item_id, texture_name)
    update_script(item_id, song_id, song_name, artist, display_color_code)
    if attachable:
        add_attachable(item_id, texture_name, attachable)
        
    if _update_readme:
        update_readme(artist, song_name, texture_name)




def get_disc_count() -> int:
    with open(ADDON_INFO_PATH, 'r') as fp:
        return int(fp.readline().strip())
    

def set_disc_count(count: int) -> None:
    with open(ADDON_INFO_PATH, 'w') as fp:
        fp.write(str(count))


def increment_disc_count(amount=1) -> None:
    with open(ADDON_INFO_PATH, 'r+') as fp:
        count = int(fp.readline().strip())
        fp.seek(0)
        fp.write(str(count+amount))



def create_item_file(item_id: str, disc_id: int, song_name: str, artist: str, color_code: str) -> None:
    
    with open("file_templates/item.json", 'r') as fp:
        template = json.load(fp)
    
    item_data = template["minecraft:item"]
    item_data["description"]["identifier"] = item_id

    if artist is not None:
        disc_name = f"§eMusic Disc\n§7{artist} - §{color_code}{song_name}"
    else:
        disc_name = f"§eMusic Disc\n§{color_code}{song_name}"

    
    item_data["components"]["minecraft:display_name"]["value"] = disc_name
    item_data["components"]["minecraft:icon"] = item_id

    with open(f"{ITEMS_DIR}custom_disc_{disc_id}.item.json", 'w') as fp:
        json.dump(template, fp, indent=4)








def update_sound_definitions(song_id: str) -> None:
    
    sound_def_file = JsonEditor.load(SOUND_DEF_PATH)

    with open("file_templates/sound_def.json", 'r') as fp:
        template = json.load(fp)

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
    with open("file_templates/attachable.json", 'r') as fp:
        attachable_data = json.load(fp)

    desc = attachable_data["minecraft:attachable"]["description"]
    desc["identifier"] = item_id
    desc["textures"]["default"] = f"{TEXTURE_FILE_REL_DIR}{texture_name}"

    with open(f"{ATTACHABLES_DIR}{attachable}.json", 'w') as fp:
        json.dump(attachable_data, fp, indent=4)








def update_script(item_id: str, song_id: str, song_name: str, artist: str, display_color_code: str) -> None:
    with open(SCRIPT_FILE_PATH, "r+", encoding="utf8") as fp:
        scanning = False
        while True:
            line = fp.readline()
            if line == "":
                raise EOFError("Script file invalid.")

            if line == "export const DiscIds = {\n":
                scanning = True
            elif scanning:
                if line.endswith("}\n"):
                    break
                elif (sections:=line.split()):
                    latest_disc_num = sections[0][:-1]
        
        new_disc_num = int(latest_disc_num)+1
        disc_data_instance = f"DiscData(\"{item_id}\", \"record.{song_id}\", \"{song_name}\", "

        if artist:
            disc_data_instance += f"\"{artist}\", "
        else:
            disc_data_instance += "null, "
        
        disc_data_instance += f"\"{display_color_code[0]}\")"

        fp.seek(fp.tell()-5, 0)
        fp.write(f",\n    {new_disc_num}: new {disc_data_instance}\n")
        fp.write(r"}")
        fp.write("\n")






def update_readme(artist: str, song_name: str, texture_name: str) -> None:
    try:
        with open(README_PATH, 'a') as fp:
            fp.write(f"  \n![](./{RP_DIR}{TEXTURE_FILE_REL_DIR}{texture_name}.png)\n{artist} - {song_name}")
    except FileNotFoundError:
        pass







class CharFormatting(NamedTuple):
    insert_before: str
    insert_after: str
    change_indent_before: int = 0
    change_indent_after: int = 0
    condition: Callable[[int], bool] = lambda i, json_string, bracket_order: True






class JsonEditor(dict[str, Any]):
    path: str

    char_formats: dict[str, CharFormatting] = {
        "{": CharFormatting("", "\n", 0, 1),
        "}": CharFormatting("\n", "", -1, 0),
        "[": CharFormatting("", "\n", 0, 1, lambda i, json_string, bracket_order: json_string[i+1] == "{"),
        "]": CharFormatting("\n", "", -1, 0, lambda i, json_string, bracket_order: json_string[i-1] == "}"),
        ":": CharFormatting("", " "),
        ",": CharFormatting("", "\n", 0, 0, lambda i, json_string, bracket_order: (bracket_order[-1] == "{" or json_string[i-1] == "}"))
    }

    

    @classmethod
    def load(cls, path: str) -> Self:
        with open(path, 'r', encoding="utf-8") as fp:
            obj = cls(json.load(fp))
            obj.path = path
        
        return obj
    

    def save(self, json_indent=4) -> None:

        json_string = json.dumps(self, ensure_ascii=False)

        indent = " "*json_indent
        indent_level = 0

        bracket_order = []

        in_quotes = False

        with open(self.path, 'w', encoding="utf-8") as fp:
            for i, char in enumerate(json_string):
                if char == '\"' and json_string[i-1] != '\\':
                    in_quotes = not in_quotes


                if not in_quotes and char == " ":
                    continue


                if in_quotes or char not in self.char_formats:
                    fp.write(char)
                    continue
                

                if char in ("{", "["):
                    bracket_order.append(char)
                elif char in ("}", "]"):
                    bracket_order.pop()

                formatting = self.char_formats[char]

                if not formatting.condition(i, json_string, bracket_order):
                    fp.write(char)
                    continue

                indent_level += formatting.change_indent_before


                fp.write(formatting.insert_before)
                if '\n' == formatting.insert_before:
                    fp.write(indent*indent_level)
                
                fp.write(char)

                indent_level += formatting.change_indent_after

                fp.write(formatting.insert_after)

                if '\n' == formatting.insert_after:
                    fp.write(indent*indent_level)



def copy_texture_file(name: str, origin: str) -> None:
    shutil.copy(origin, f"{RP_DIR}{TEXTURE_FILE_REL_DIR}{name}")


def copy_audio_file(name: str, origin: str):
    shutil.copy(origin, f"{RP_DIR}{SOUND_FILE_REL_DIR}{name}")