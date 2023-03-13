from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Select <button> from the Cohort Bar")
def click_button_on_cohort_bar(button_name: str):
    APP.cohort_bar.click_cohort_bar_button(button_name)

@step("Name the cohort <cohort_name> and <button_name> in the Cohort Bar")
def name_cohort_and_click_button(cohort_name: str, button_name: str):
    APP.home_page.send_text_into_search_bar(cohort_name, "Input field for new cohort name")
    APP.cohort_bar.click_cohort_bar_named_button(button_name)
