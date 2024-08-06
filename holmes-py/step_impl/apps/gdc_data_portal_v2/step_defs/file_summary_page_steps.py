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

@step("Select file download button on the file summary page")
def click_download_file():
    APP.file_summary_page.click_download_file_button()

@step("In table <table_name> on row <row_identifier> select <button_id>")
def table_button_click(table_name:str, row_identifier:str, button_id: str):
    APP.file_summary_page.click_button_in_table(table_name, row_identifier, button_id)
