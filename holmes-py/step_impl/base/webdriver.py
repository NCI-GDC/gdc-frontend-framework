from os import path, getenv
from pathlib import Path
from uuid import uuid1
import json
import time

from getgauge.python import (
    custom_screenshot_writer,
    before_suite,
    after_suite,
)
from playwright.sync_api import sync_playwright

from .utility import Utility


AUTH_FILE_PATH = f"{Utility.parent_dir()}/step_impl/base/auth.json"


class WebDriver:
    instance = None
    page = None
    context = None

    @before_suite
    def init(self):
        # Reset the auth file before every run
        with open(AUTH_FILE_PATH, "w") as f:
            f.write("{}")
        _browser = getenv("browser").lower().strip()
        _headless = True if "headless" in _browser else False
        playwright = sync_playwright().start()
        browser = WebDriver.launch_browser(playwright, _browser, _headless)
        WebDriver.instance = browser

    @before_suite
    def start_page(self):
        ignore_https_errors = False
        if getenv("IS_DOCKER") == "1":
            # Directly set viewport size if using Docker/Gitlab
            WebDriver.context = WebDriver.instance.new_context(
                storage_state=AUTH_FILE_PATH,
                ignore_https_errors=ignore_https_errors,
                viewport={"width": 2000, "height": 1300},
            )
            WebDriver.page = WebDriver.context.new_page()
        else:
            WebDriver.context = WebDriver.instance.new_context(
                storage_state=AUTH_FILE_PATH, ignore_https_errors=ignore_https_errors
            )
            WebDriver.page = WebDriver.context.new_page()
            WebDriver.set_tab_viewport_size(WebDriver.page)

    def set_authenticated_context():
        # Gives the authenticated storage state to the context mid-run
        WebDriver.context.set_storage_state(AUTH_FILE_PATH)

    def set_tab_viewport_size(page):
        if getenv("IS_DOCKER") == "1":
            # Directly set viewport size if using Docker/Gitlab
            page.set_viewport_size({"width": 2000, "height": 1300})
        else:
            screen_size = Utility.get_screen_size()
            if screen_size:
                screen_width = screen_size["width"]
                # 1300 pixels on height is the minimum size for all tests to pass. The tests behave as expected
                # on screens with a height smaller than 1300 pixels as the window can be scrolled vertically.
                if screen_width >= 2000:
                    # 2000 pixels is the maximum width size of a test automation window
                    # to ensure consistent test results.
                    page.set_viewport_size({"width": 2000, "height": 1300})
                else:
                    # If width is smaller than 2000 pixels, set it to screen size.
                    page.set_viewport_size({"width": screen_width, "height": 1300})

    def launch_browser(playwright, _browser, _headless):
        # Launches browser based on set browser type and headless setting
        if "chrome" in _browser:
            browser = playwright.chromium.launch(
                headless=_headless, ignore_default_args=["--start-fullscreen"]
            )  # instance is PW browser
        elif "firefox" in _browser:
            browser = playwright.firefox.launch(
                headless=_headless
            )  # instance is PW browser
        elif "edge" in _browser:
            is_docker = getenv("IS_DOCKER")
            if is_docker and is_docker.strip() == "1":
                raise ValueError("Cannot run Edge tests in Docker environment")
            browser = playwright.chromium.launch(channel="msedge", headless=_headless)
        elif "webkit" in _browser:
            browser = playwright.webkit.launch(
                headless=_headless
            )  # instance is PW browser
        return browser

    @after_suite
    def close_and_quit(self):
        WebDriver.instance.close()
        # Reset the auth file after every run
        with open(AUTH_FILE_PATH, "w") as f:
            f.write("{}")


@custom_screenshot_writer
def take_screenshot():
    screenshot_path = Path(getenv("gauge_screenshots_dir")).joinpath(
        f"screenshot_{uuid1().int}.png"
    )
    WebDriver.page.screenshot(full_page=True, path=screenshot_path)
    return screenshot_path.absolute()
