from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Selecting these buttons should take the user to correct page in the same tab <table>")
def click_same_tab_nav_button(table):
    for k, v in enumerate(table):
        APP.home_page.click_button_with_text(v[0])
        APP.header_section.wait_for_page_to_load(v[1])
        APP.home_page.visit()

@step("Live statistics should display correct values <table>")
def validate_live_statistics_display(table):
    for k, v in enumerate(table):
        is_stat_present = APP.home_page.is_live_category_statistic_present(v[1])
        assert is_stat_present, f"For category '{v[0]}', the expected statistic {v[1]} is NOT present"
