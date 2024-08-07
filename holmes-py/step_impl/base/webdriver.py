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
    context = None

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
        elif "edge" in _browser:
            is_docker = getenv("IS_DOCKER")
            if is_docker and is_docker.strip() == "1":
                raise ValueError("Cannot run Edge tests in Docker environment")
            WebDriver.instance = playwright.chromium.launch(
                channel="msedge", headless=_headless
            )
        elif "webkit" in _browser:
            WebDriver.instance = playwright.webkit.launch(
                headless=_headless
            )  # instance is PW browser

    @before_suite
    def start_page(self):
        if getenv("IS_DOCKER") == "1":
            ignore_https_errors = False
        else:
            ignore_https_errors = False
        WebDriver.context = WebDriver.instance.new_context(
            ignore_https_errors=ignore_https_errors
        )
        WebDriver.page = WebDriver.context.new_page()
        # Try/except around this screensize step as a workaround to this not working within Docker runs
        if not getenv("IS_DOCKER"):
            screen_size = Utility.get_screen_size()
            if screen_size:
                WebDriver.page.set_viewport_size(
                    {"width": screen_size["width"], "height": screen_size["height"]}
                )
            else:
                WebDriver.context.add_init_script(
                    """
                    () => {
                        window.moveTo(0, 0);
                        window.resizeTo(window.screen.availWidth, window.screen.availHeight);
                    }
                """
                )

    @after_suite
    def close_and_quit(self):
        WebDriver.instance.close()


@custom_screenshot_writer
def take_screenshot():
    screenshot_path = Path(getenv("gauge_screenshots_dir")).joinpath(
        f"screenshot_{uuid1().int}.png"
    )
    WebDriver.page.screenshot(full_page=True, path=screenshot_path)
    return screenshot_path.absolute()
