import json
from typing import Self, Callable, Any, NamedTuple

from utils import *



UPDATE_README = True





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





def create_disc() -> None:
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
    
    add_disc(item_id,
             disc_id,
             texture_name,
             song_id,
             song_name,
             artist,
             display_color_code,
             attachable,
             UPDATE_README)
    
    increment_disc_count()

    print(f"Added disc {item_id}")










if __name__ == "__main__":
    create_disc()