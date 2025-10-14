"""
Run this script to add a music disc to the pack.
"""


import tkinter as tk
from tkinter import filedialog

import os
from typing import Literal

from things_for_script.utils import copy_texture_file, copy_audio_file, get_disc_count, add_disc, increment_disc_count


SIDEBAR_COLOR = "#000011"
FONT_COLOR = "#ddddee"

UPDATE_README = True

def main():
    window = tk.Tk(baseName="Test Window")
    window.config(background=SIDEBAR_COLOR)
    window.geometry("720x480")
    window.resizable(False, False)

    window.title("Test Window")
    try:
        window.iconphoto(True, tk.PhotoImage(file="jjj_disc_pack_RP/pack_icon.png"))
    except tk.TclError:
        pass

    

    sidebar = tk.Frame(window, bg=SIDEBAR_COLOR, bd=15)
    sidebar.place(x=0, y=0)
    main_panel = tk.Frame(window)
    main_panel.place(x=150, y=0)

    tk.Label(sidebar,
             text="Add New Music Disc",
             font=("Arial", 20, "bold"),
             bg=SIDEBAR_COLOR,
             fg=FONT_COLOR).pack(pady=(7, 0))

    song_name = LabelEntry(sidebar, "Song Name")
    song_name.pack()
    artist = LabelEntry(sidebar, "Artist")
    artist.pack()

    # text_color = tk.StringVar(window, "test")
    # color_selector = tk.OptionMenu(sidebar, text_color, "test", "ok", "say that again")
    # color_selector.pack(anchor=tk.NW, padx=5)
    # color_selector.config(bg="#22aaff", fg="#eeeeee", font=("Arial", 12, "bold"), border=0, relief=tk.FLAT)

    texture_file = FileSelector(sidebar, "Select texture file", "png")
    texture_file.pack()

    is_attachable = tk.BooleanVar(value=False)
    tk.Checkbutton(sidebar,
                   text="Is your texture a custom size (not 16x16)",
                   bg=SIDEBAR_COLOR,
                   fg=FONT_COLOR,
                   onvalue=True,
                   offvalue=False,
                   variable=is_attachable).pack(padx=0, pady=(0, 7))

    audio_file = FileSelector(sidebar, "Select audio file", "ogg")
    audio_file.pack()

    


    
    def add_assets_and_disc():
        disc_id = get_disc_count()+1
        disc_name = f"custom_disc_{disc_id}"
        item_id = f"jjj:{disc_name}"
        copy_texture_file(f"{disc_name}.png", texture_file.get())

        audio_path = audio_file.get()
        copy_audio_file(f"{disc_name}.{os.path.splitext(audio_path)[-1]}", audio_path)

        
        if is_attachable.get():
            attachable = disc_name
        else:
            attachable = ""

        add_disc(item_id,
                 disc_id,
                 disc_name,
                 disc_name,
                 song_name.get(),
                 artist.get(),
                 '5',
                 attachable,
                 UPDATE_README)
        
        increment_disc_count()

        quit()




    


    confirm_button = tk.Button(window,
                               text="Add Music Disc",
                               font=("Arial", 12, "bold"),
                               bg="#22aaff",
                               fg="#eeeeee",
                               state="disabled",
                               disabledforeground="#0088cc",
                               command=add_assets_and_disc)
    confirm_button.place(x=550, y=420)

    
    def logic_loop():
        if confirm_button["state"] != "active":
            if (song_name.get()
                and artist.get()
                and texture_file.get()
                and audio_file.get()):
                
                confirm_button.config(state="normal")
            else:
                confirm_button.config(state="disabled")
        
        window.after(50, logic_loop)

    logic_loop()
    window.mainloop()







def open_file(dialog_title: str, file_type: str) -> str:
    return filedialog.askopenfilename(
                        title=dialog_title,
                        filetypes=[
                            (file_type, f"*.{file_type}"),
                            ("All files", "*")])















class LabelEntry(tk.Entry):
    def __init__(self, master: tk.Misc, text: str, default="", style: Literal["text", "code"] = "text"):
        if style == "text":
            font = "Arial"
        else:
            font = "Consolas"
        super().__init__(master, font=(font, 10, "bold"), bg="#dddeee")
        self.__text = tk.Label(master, text=text, bg=SIDEBAR_COLOR, font=("Arial", 10, "bold"), fg=FONT_COLOR)

        if default:
            self.insert(0, default)


    def pack(self):
        self.__text.pack(anchor=tk.NW, padx=5, pady=(7, 0))
        super().pack(anchor=tk.NW, padx=5, pady=(0, 7))
    def update_text(self, new_text: str):
        self.__text.config(text=new_text)



class FileSelector(tk.Button):
    def __init__(self, master: tk.Misc, prompt: str, file_type: str):
        self.__prompt = prompt
        self.__file_type = file_type
        self.__file_path: str | None = None
        self.__label = tk.Label(master, text="", font=("Arial", 7, "bold"), bg=SIDEBAR_COLOR, fg=FONT_COLOR)
        super().__init__(master, text=prompt,  font=("Arial", 10, "bold"), bg="#4488AA", fg="#eeeeee", command=self.__open_file)


    def pack(self):
        super().pack(anchor=tk.NW, padx=5, pady=7)
        self.__label.pack(anchor=tk.NW, padx=5, pady=(0, 7))


    def __open_file(self):
        self.__file_path = open_file(self.__prompt, self.__file_type)
        self.__label.config(text=os.path.basename(self.__file_path))


    def get(self) -> str | None:
        return self.__file_path






if __name__ == "__main__":
    main()