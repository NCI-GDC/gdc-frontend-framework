from pathlib import Path
from os import path, getenv
import time


class Utility:
    def parent_dir(path_from=__file__):
        for path in Path(path_from).parents:
            git_dir = path / ".git"
            holmes_dir = path / "holmes-py"
            if holmes_dir.is_dir():
                return holmes_dir
            elif git_dir.is_dir():
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
        # Try/except around pyautogui as a workaround to this not working within Docker runs
        if not getenv("IS_DOCKER"):
            import AppKit
            import pyautogui

            width, height = pyautogui.size()
            return {"width": width, "height": height}

    def validate_json_key_exists(json_obj, json_key, fails):
        try:
            json_obj[json_key]
        except:
            fails[json_key] = f"NOT FOUND. {json_obj}"
        finally:
            return fails

    def flatten_json(y):
        out = {}

        def flatten(x, name=""):
            if type(x) is dict:
                for a in x:
                    flatten(x[a], name + a + ".")
            elif type(x) is list:
                i = 0
                for a in x:
                    flatten(a, name)
                    i += 1
            else:
                out[name[:-1]] = x

        flatten(y)
        return out
