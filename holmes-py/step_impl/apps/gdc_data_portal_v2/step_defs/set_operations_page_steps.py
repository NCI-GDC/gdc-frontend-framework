from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver
from getgauge.python import data_store

import time

@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Collect these set item counts on the Set Operations selection screen <table>")
def store_set_item_count_for_comparison(table):
    """
    Stores specified set item count for comparison in future tests.
    Pairs with the test 'verify_compared_statistics_are_equal_or_not_equal'

    :param v[0]: The set to collect count of (typically a cohort set).
    """
    for k, v in enumerate(table):
        data_store.spec[f"{v[0]} Count Set Operations"] = APP.set_operations_page.get_item_count_selection_screen_set_operations(v[0])

@step("Collect these save set item counts on the Set Operations analysis screen <table>")
def store_save_set_item_count_for_comparison(table):
    """
    Stores specified save set item count buttons for comparison in future tests.
    Pairs with the test 'verify_compared_statistics_are_equal_or_not_equal'

    :param v[0]: The save set button to collect count of.
    """
    for k, v in enumerate(table):
        data_store.spec[f"{v[0]} Count Set Operations"] = APP.set_operations_page.get_save_set_button_count_analysis_screen_set_operations(v[0])

@step("Collect union row save set item count as <save_as_name> on the Set Operations analysis screen")
def store_save_set_item_count_for_comparison(save_as_name:str):
    """
    Stores union row save set item count button for comparison in future tests.
    Pairs with the test 'verify_compared_statistics_are_equal_or_not_equal'

    :param save_as_name: The identifier to access the saved data at a later point.
    """
    data_store.spec[f"{save_as_name} Count Set Operations"] = APP.set_operations_page.get_union_row_save_set_button_count_analysis_screen_set_operations()

@step("Validate these item counts are correct in the Set Operations selection screen <table>")
def validate_set_item_counts(table):
    for k, v in enumerate(table):
        item_count = APP.set_operations_page.get_item_count_selection_screen_set_operations(v[0])
        assert item_count == v[1], f"Item count for set '{v[0]}' is {item_count} when we expected {v[1]}"
        time.sleep(0.1)

@step("Run analysis on Set Operations")
def click_run_cohort_comparison_selection_screen():
    """
    Clicks the 'run' button on the Set Operation selection screen.
    Waits for loading spinners to appear and disappear on the analysis screen.
    """
    APP.set_operations_page.click_run_set_operations_selection_screen()
    # Need to wait for loading spinners to be present and then to disappear.
    try:
        APP.shared.wait_for_loading_spinner_to_be_visible(5000)
        APP.shared.wait_for_loading_spinner_to_detatch()
    except:
        APP.shared.wait_for_loading_spinner_to_detatch()


@step("Checkbox <checkbox_name> should be disabled in the Set Operations app")
def is_checkbox_disabled(checkbox_name: str):
    is_checkbox_disabled = APP.set_operations_page.is_checkbox_disabled_set_operations(checkbox_name)
    assert is_checkbox_disabled, f"Checkbox '{checkbox_name}' is enabled when it should NOT be"

@step("Checkbox <checkbox_name> should be enabled in the Set Operations app")
def is_checkbox_enabled(checkbox_name: str):
    is_checkbox_enabled = APP.set_operations_page.is_checkbox_enabled_set_operations(checkbox_name)
    assert is_checkbox_enabled, f"Checkbox '{checkbox_name}' is disabled when it should NOT be"

@step("Select the following checkboxes in the Set Operations selection screen <table>")
def click_checkboxes_selection_screen(table):
    for k, v in enumerate(table):
        APP.set_operations_page.click_checkbox_set_operations(v[0])
        time.sleep(0.1)

@step("Select the following checkboxes in the Set Operations analysis screen <table>")
def click_checkboxes_analysis_screen(table):
    for k, v in enumerate(table):
        checkbox_to_click = APP.shared.normalize_identifier_underscore_keep_capitalization(v[0])
        APP.set_operations_page.click_checkbox_set_operations(checkbox_to_click)
        time.sleep(0.1)

@step("Select set <intersection_set_name> to save as a new set in the Set Operations analysis screen")
def click_save_set_button(intersection_set_name:str):
     """Clicks specified save set button"""
     APP.set_operations_page.click_save_set_button_set_operations(intersection_set_name)

@step("Select Union Row to save as a new set in the Set Operations analysis screen")
def click_union_row_save_set_button():
     """Clicks union row save set button"""
     APP.set_operations_page.click_union_row_save_set_button_set_operations()

@step("Name set <set_name> in Save Set modal")
def name_set_in_modal(set_name: str):
    """
    This step is used to name and save a set in the save set modal.
    Pairs with the step 'click_save_set_button' located in in this file.
    """
    APP.shared.send_text_into_text_box(set_name, "Set Name")
    APP.shared.click_button_with_displayed_text_name("Save")
    APP.manage_sets_page.wait_for_set_text_in_temporary_message("Set has been saved.")
