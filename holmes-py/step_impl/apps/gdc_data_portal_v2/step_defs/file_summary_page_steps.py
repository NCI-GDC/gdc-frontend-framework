from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)


@step("Add file to cart on the file summary page")
def add_file_to_cart():
    APP.file_summary_page.add_file_to_cart()


@step("Remove file from cart on the file summary page")
def add_file_to_cart():
    APP.file_summary_page.remove_file_from_cart()
