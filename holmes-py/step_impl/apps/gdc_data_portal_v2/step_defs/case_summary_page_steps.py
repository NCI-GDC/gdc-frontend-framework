from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)


@step("Add all files to cart on the case summary page")
def add_file_to_cart():
    APP.case_summary_page.add_file_to_cart()


@step("Remove all files from cart on the case summary page")
def add_file_to_cart():
    APP.case_summary_page.remove_file_from_cart()
