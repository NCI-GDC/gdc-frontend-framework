from getgauge.python import step

from step_impl.base.webdriver import WebDriver
from step_impl.apps.playwright_example.app import GDCDataPortalApp


@step("On GDC Data Portal app")
def navigate_to_app():
    global APP
    WebDriver.page = WebDriver.instance.new_page()
    APP = GDCDataPortalApp(WebDriver.page)
    APP.home_page.visit()
    APP.home_page.click_cancel_button_and_wait()


@step("Find and download file from <table_name>")
def find_and_download_file(table):
    for row, value in enumerate(table):
        file_UUID = table[row][0]
        print("File's UUID", file_UUID)
        APP.home_page.search_and_click_on_front_page(file_UUID)


@step("Attempt to download a controlled file")
def attempt_to_download_controlled_file():
    is_download_disabled = APP.home_page.find_and_attempt_download_of_controlled_file()
    assert is_download_disabled, "FAILED: Unauthorized file can be downloaded"
