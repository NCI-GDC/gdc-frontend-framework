import time

from getgauge.python import step

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@step("Pause <sleep_time> seconds")
def pause_10_seconds(sleep_time):
    time.sleep(int(sleep_time))


@step("Go to <page_name> page")
def go_to_page(page_name):
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)
    pages = {"Analysis": APP.analysis_page.visit()}
    pages[page_name]


@step("Navigate to <page_name> from <from_page_name> page")  # will have click actions
def navigate_to_page_in_page(page_name, from_page_name):
    pages = {"Analysis": APP.analysis_page.navigate_to_tool(page_name)}
    pages[from_page_name]


@step("Verify that the <title_name> title is displayed in <page_name> page")
def verify_title_name_in_page(title_name, page_name):
    pages = {"Repository": APP.repository_page.get_title(title_name)}
    title_name_value = pages[page_name]
    assert (
        title_name == title_name_value
    ), f"Unexpected title detected: looking for {title_name}, but got {title_name_value}"
