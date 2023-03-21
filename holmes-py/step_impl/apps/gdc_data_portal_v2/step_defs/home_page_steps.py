from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Selecting these buttons should take the user to correct page in the same tab <table>")
def click_nav_button_same_tab(table):
    for k, v in enumerate(table):
        APP.home_page.click_button_ident_a_with_displayed_text_name(v[0])
        APP.header_section.wait_for_page_to_load(v[1])
        APP.home_page.visit()

@step("These buttons on the <page_name> should take the user to correct page in a new tab <table>")
def click_nav_item_new_tab(page_name: str, table):
    for k, v in enumerate(table):
        new_tab = APP.home_page.perform_action_handle_new_tab(page_name, v[0])
        is_text_visible = APP.home_page.is_text_visible_on_new_tab(new_tab,v[1])
        assert is_text_visible, f"After click on '{v[0]}', the expected text '{v[1]}' in NOT present"
        new_tab.close()

@step("Live statistics should display correct values <table>")
def validate_live_statistics_display(table):
    for k, v in enumerate(table):
        is_stat_present = APP.home_page.is_live_category_statistic_present(v[1])
        assert is_stat_present, f"For category '{v[0]}', the expected statistic {v[1]} is NOT present"
