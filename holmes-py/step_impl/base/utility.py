from pathlib import Path
from os import path
import pyautogui
import time


class Utility:
    def parent_dir(path_from=__file__):
        for path in Path(path_from).parents:
            # print(f"path: {path}")
            git_dir = path / ".git"
            if git_dir.is_dir():
                return path

    def is_file_found(file_path: str):
        CURRENT_TIME = 0
        WAIT_TIME = 0.05
        MAX_TIME = 5

        while not path.isfile(file_path) and not CURRENT_TIME > MAX_TIME:
            CURRENT_TIME += WAIT_TIME
            time.sleep(WAIT_TIME)

        return path.isfile(file_path)

    def get_screen_size():
        width, height = pyautogui.size()
        return {"width": width, "height": height}
