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

@step("Name the cohort <cohort_name> in the Cohort Bar section")
def name_cohort_and_click_button(cohort_name: str):
    APP.home_page.send_text_into_search_bar(cohort_name, "Input field for new cohort name")

@step("<button_name> <cohort_name> in the Cohort Bar section")
def name_cohort_and_click_button(button_name: str, cohort_name: str):
    APP.home_page.click_button_with_displayed_text_name(button_name)
    is_cohort_message_present= APP.cohort_bar.wait_for_text_in_cohort_message(cohort_name)
    assert is_cohort_message_present, f"The text '{cohort_name}' is NOT present"
