from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver
from getgauge.python import data_store

import time

@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Is temporary modal with text <expected_text> present on the page and <action>")
def is_modal_text_present_on_the_page(expected_text: str, action: str):
    """Waits for modal with specified text and optionally removes modal"""
    is_text_present = APP.modal.wait_for_text_in_temporary_message(
        expected_text, action
    )
    assert is_text_present, f"The text '{expected_text}' is NOT present in a modal"
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()

@step("Switch to tab <tab_name> in Modal")
def switch_tabs(tab_name:str):
    APP.modal.click_tab_name(tab_name)

@step("Verify the set <set_name> displays a count of <number_of_items> in Modal")
def validate_set_count(set_name:str, number_of_items:str):
    displayed_set_count = APP.modal.get_set_count(set_name)
    assert (
        displayed_set_count == number_of_items
    ), f"The modal displays set '{set_name}' has count of '{displayed_set_count}' instead of expected '{number_of_items}'"

@step("Verify the cohort <cohort_name> displays a count of <number_of_items> in Modal")
def validate_set_count(set_name:str, number_of_items:str):
    displayed_set_count = APP.modal.get_cohort_count(set_name)
    assert (
        displayed_set_count == number_of_items
    ), f"The modal displays set '{set_name}' has count of '{displayed_set_count}' instead of expected '{number_of_items}'"
