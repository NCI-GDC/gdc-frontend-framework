from os import getenv
from pathlib import Path
from uuid import uuid1

from getgauge.python import (
    custom_screenshot_writer,
    before_suite,
    after_suite,
)
from playwright.sync_api import sync_playwright

from .utility import Utility


class WebDriver:
    instance = None
    page = None

    @before_suite
    def init(self):
        _browser = getenv("browser").lower().strip()
        _headless = True if "headless" in _browser else False
        playwright = sync_playwright().start()
        if "chrome" in _browser:
            WebDriver.instance = playwright.chromium.launch(
                headless=_headless, ignore_default_args=["--start-fullscreen"]
            )  # instance is PW browser
        elif "firefox" in _browser:
            WebDriver.instance = playwright.firefox.launch(
                headless=_headless
            )  # instance is PW browser
        elif "webkit" in _browser:
            WebDriver.instance = playwright.webkit.launch(
                headless=_headless
            )  # instance is PW browser

    @before_suite
    def start_page(self):
        WebDriver.page = WebDriver.instance.new_page()
        try:
            screen_size = Utility.get_screen_size()
            WebDriver.page.set_viewport_size(
                {"width": screen_size["width"], "height": screen_size["height"]}
            )
        except:
            pass

    @after_suite
    def close_and_quit(self):
        WebDriver.instance.close()


@custom_screenshot_writer
def take_screenshot():
    screenshot_path = Path(getenv("gauge_screenshots_dir")).joinpath(
        f"screenshot_{uuid1().int}.jpg"
    )
    WebDriver.page.screenshot(path=screenshot_path)
    return screenshot_path.absolute()
