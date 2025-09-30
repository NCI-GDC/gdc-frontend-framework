from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver

@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

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
