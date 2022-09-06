from pathlib import Path


class BasePage(object):
    def __init__(self, driver):
        self.driver = driver

    def parent_dir(path_from=__file__):
        for path in Path(path_from).parents:
            print(f"path: {path}")
            git_dir = path / ".git"
            if git_dir.is_dir():
                return path
