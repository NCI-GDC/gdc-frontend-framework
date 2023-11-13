from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Select Create Set and from the dropdown choose <set_dropdown_option>")
def name_cohort(set_dropdown_option: str):
    APP.manage_sets_page.click_create_set_and_select_from_dropdown(set_dropdown_option)
