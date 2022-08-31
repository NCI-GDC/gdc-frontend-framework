import os
from pathlib import Path
from uuid import uuid1

from getgauge.python import custom_screenshot_writer, before_suite, after_suite

from playwright.sync_api import sync_playwright


class WebDriver:
    instance = None
    page = None

    @before_suite
    def init(self):
        _browser = os.getenv("browser").lower().strip()
        playwright = sync_playwright().start()
        if "chrome" in _browser:
            WebDriver.instance = playwright.chromium.launch(
                headless=False
            )  # instance is PW browser
        elif "firefox" in _browser:
            WebDriver.instance = playwright.firefox.launch(
                headless=False
            )  # instance is PW browser

    @after_suite
    def close_and_quit(self):
        WebDriver.instance.close()


@custom_screenshot_writer
def take_screenshot():
    screenshot_path = Path(os.getenv("gauge_screenshots_dir")).joinpath(
        f"screenshot-{uuid1().int}"
    )
    WebDriver.page.screenshot(path=screenshot_path)
    return screenshot_path.absolute()
