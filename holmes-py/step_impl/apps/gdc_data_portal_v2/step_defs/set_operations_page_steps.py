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
def store_count_repository_for_comparison(table):
    """
    Stores specified set item count for comparison in future tests.
    Pairs with the test 'verify_compared_statistics_are_equal_or_not_equal'

    :param v[0]: The set to collect count of (typically a cohort set).
    """
    for k, v in enumerate(table):
        data_store.spec[f"{v[0]} Count Set Operations"] = APP.set_operations_page.get_item_count_selection_screen_set_operations(v[0])

@step("Validate these item counts are correct in the Set Operations selection screen <table>")
def validate_set_item_counts(table):
    for k, v in enumerate(table):
        item_count = APP.set_operations_page.get_item_count_selection_screen_set_operations(v[0])
        assert item_count == v[1], f"Item count for set '{v[0]}' is {item_count} when we expected {v[1]}"
        time.sleep(0.1)

@step("Checkbox <checkbox_name> should be disabled in the Set Operations app")
def is_checkbox_disabled(checkbox_name: str):
    is_checkbox_disabled = APP.set_operations_page.is_checkbox_disabled_set_operations(checkbox_name)
    assert is_checkbox_disabled, f"Checkbox '{checkbox_name}' is enabled when it should NOT be"

@step("Checkbox <checkbox_name> should be enabled in the Set Operations app")
def is_checkbox_enabled(checkbox_name: str):
    is_checkbox_enabled = APP.set_operations_page.is_checkbox_enabled_set_operations(checkbox_name)
    assert is_checkbox_enabled, f"Checkbox '{checkbox_name}' is disabled when it should NOT be"

@step("Select the following checkboxes in the Set Operations app <table>")
def click_checkboxes(table):
    for k, v in enumerate(table):
        APP.set_operations_page.click_checkbox_set_operations(v[0])
        time.sleep(0.1)
