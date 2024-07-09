from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver

import time

@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

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
