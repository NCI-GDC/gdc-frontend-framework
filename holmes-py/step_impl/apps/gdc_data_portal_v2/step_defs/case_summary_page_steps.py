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

@step("Select <button_name> on Case Summary page")
def click_case_summary_page_button(button_name: str):
    APP.case_summary_page.click_button(button_name)

@step("Select tab <button_name> on Case Summary page")
def click_tab_clinical_table_page_button(button_name: str):
    APP.case_summary_page.click_clinical_table_tab(button_name)

@step("Search <text_to_send> in the files table on the case summary page")
def search_in_files_table(text_to_send: str):
    APP.case_summary_page.search_in_files_table(text_to_send)
