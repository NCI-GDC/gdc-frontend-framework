import time

from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver

@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("These Apps links should take the user to correct page in new tab <table>")
def click_apps_link_new_tab(table):
    """
    Clicks open the Apps Menu in upper-right corner of header, and clicks on specified link in menu.
    Then, checks url in new tab to assert it opened correctly.
    """
    for k, v in enumerate(table):
        APP.header_section.click_apps_menu()
        new_tab = APP.shared.perform_action_handle_new_tab("Header", v[0])
        is_url_correct = APP.shared.is_url_correct_on_new_tab(new_tab, v[1])
        new_tab.close()
        time.sleep(0.4)
        assert (
            is_url_correct
        ), f"After click on '{v[0]}', the expected URL '{v[1]}' in NOT present"

@step("These Apps links should take the user to correct page in the same tab <table>")
def click_apps_link_same_tab(table):
    for k, v in enumerate(table):
        APP.header_section.navigate_with_apps_menu(v[0])
        is_text_present = APP.shared.is_text_present(v[1])
        APP.home_page.visit()
        assert is_text_present, f"The text '{v[2]}' is NOT present on Apps link '{v[0]}'"

@step("Select link <header_button> from the header section")
def click_header_link(header_button:str):
    APP.shared.click_header_button(header_button)

@step("Open username menu from the header section")
def open_username_dropdown_menu():
    APP.header_section.open_username_dropdown_menu()
