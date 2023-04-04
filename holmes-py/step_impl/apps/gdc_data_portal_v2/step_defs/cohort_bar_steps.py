import time

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

@step("<button_name> <cohort_name> and <action> in the Cohort Bar section")
def name_cohort_and_click_button(button_name: str, cohort_name: str, action: str):
    APP.home_page.click_button_with_displayed_text_name(button_name)
    is_cohort_message_present= APP.cohort_bar.wait_for_text_in_cohort_message(cohort_name, action)
    assert is_cohort_message_present, f"The text '{cohort_name}' is NOT present"
    # Need to let the page load after our actions here.
    # Automation moves too quickly in the cohort bar section.
    time.sleep(1)

@step("Name the cohort <cohort_name> in the Cohort Bar section")
def name_cohort_and_click_button(cohort_name: str):
    APP.home_page.send_text_into_search_bar(cohort_name, "Input field for new cohort name")

@step("<button_name> should be disabled in the Cohort Bar")
def button_should_be_disabled_on_cohort_bar(button_name: str):
    is_button_disabled = APP.cohort_bar.is_cohort_bar_button_disabled(button_name)
    assert is_button_disabled, f"The cohort bar button {button_name} is NOT disabled"

@step("Select <cohort_name> from the Cohort Bar dropdown list")
def select_cohort_from_dropdown(cohort_name: str):
    APP.cohort_bar.select_cohort_from_dropdown(cohort_name)

@step("Set as current cohort")
def set_as_current_cohort_from_temp_message():
    APP.cohort_bar.click_set_as_current_cohort_from_temp_message()

@step("The secondary Cohort Bar save screen should appear")
def is_secondary_cohort_bar_save_screen_present():
    is_second_save_modal_present = APP.cohort_bar.is_secondary_cohort_bar_save_screen_present()
    assert is_second_save_modal_present, f"The secondary save modal is NOT present"
