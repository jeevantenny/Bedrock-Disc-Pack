from typing import Self, Callable, NamedTuple, Any
import json




BP_DIR = "discy_business_BP/"
RP_DIR = "discy_business_RP/"


ITEMS_DIR = f"{BP_DIR}items/jjj_custom_discs/"

SCRIPT_FILE_PATH = f"{BP_DIR}scripts/music_discs.js"

SOUND_DEF_PATH = f"{RP_DIR}sounds/sound_definitions.json"
SOUND_FILE_REL_DIR = "sounds/music/game/records/"

TEXTURES_REF_PATH = f"{RP_DIR}textures/item_texture.json"
TEXTURE_FILE_REL_DIR = "textures/items/jjj_custom_discs/"

ATTACHABLES_DIR = f"{RP_DIR}attachables/"

README_PATH = "README.md"







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
        with open(path, 'r', encoding="utf-8") as f:
            obj = cls(json.load(f))
            obj.path = path
        
        return obj
    

    def save(self, json_indent=4) -> None:

        json_string = json.dumps(self, ensure_ascii=False)

        indent = " "*json_indent
        indent_level = 0

        bracket_order = []

        in_quotes = False

        with open(self.path, 'w', encoding="utf-8") as f:
            for i, char in enumerate(json_string):
                if char == '\"' and json_string[i-1] != '\\':
                    in_quotes = not in_quotes


                if not in_quotes and char == " ":
                    continue


                if in_quotes or char not in self.char_formats:
                    f.write(char)
                    continue
                

                if char in ("{", "["):
                    bracket_order.append(char)
                elif char in ("}", "]"):
                    bracket_order.pop()

                formatting = self.char_formats[char]

                if not formatting.condition(i, json_string, bracket_order):
                    f.write(char)
                    continue

                indent_level += formatting.change_indent_before


                f.write(formatting.insert_before)
                if '\n' == formatting.insert_before:
                    f.write(indent*indent_level)
                
                f.write(char)

                indent_level += formatting.change_indent_after

                f.write(formatting.insert_after)

                if '\n' == formatting.insert_after:
                    f.write(indent*indent_level)