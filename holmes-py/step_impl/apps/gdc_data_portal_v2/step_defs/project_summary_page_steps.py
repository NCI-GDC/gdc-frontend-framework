from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver

from getgauge.python import data_store


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)


@step("Select <button_name> on Project Summary page")
def select_repository_page_button(button_name: str):
    APP.project_summary_page.click_button(button_name)


@step("Collect <text_to_collect> on Project Summary page")
def store_text_project_summary_for_comparison(text_to_collect: str):
    """
    Stores specified text for comparison in future tests.
    Pairs with the test 'verify_compared_statistics_are_equal_or_not_equal'
    """
    data_store.spec[
        f"{text_to_collect} Project Summary"
    ] = APP.project_summary_page.get_text_project_summary(text_to_collect)
