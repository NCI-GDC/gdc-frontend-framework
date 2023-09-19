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
    time.sleep(0.5)
    APP.cohort_bar.click_cohort_bar_button(button_name)
    time.sleep(0.5)

@step("<button_name> <message_text> and <action> in the Cohort Bar section")
def click_named_button_wait_for_message_text(button_name: str, message_text: str, action: str):
    """
    name_cohort_and_click_button clicks a button by its displayed name in a cohort modal,
    waits for text to appear in a temporary message, and either clicks the 'x' to
    remove the temp message or let is persist

    :param button_name: The name of the button to be clicked
    :param message_text: The text in the temporary message that we are waiting for
    :param action: Input of "Removal Modal" will remove the temp message, otherwise we let it persist
    """
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
    APP.shared.click_button_with_displayed_text_name(button_name)
    is_cohort_message_present= APP.cohort_bar.wait_for_text_in_temporary_message(message_text, action)
    assert is_cohort_message_present, f"The text '{message_text}' is NOT present"
    # Need to let the page load after our actions here.
    # Automation moves too quickly in the cohort bar section.
    time.sleep(1)
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()

@step("Name the cohort <cohort_name> in the Cohort Bar section")
def name_cohort(cohort_name: str):
    APP.shared.send_text_into_search_bar(cohort_name, "Input field for new cohort name")

@step("<button_name> should be disabled in the Cohort Bar")
def button_should_be_disabled_on_cohort_bar(button_name: str):
    is_button_disabled = APP.cohort_bar.is_cohort_bar_button_disabled(button_name)
    assert is_button_disabled, f"The cohort bar button {button_name} is NOT disabled"

@step("<cohort_name> should be the active cohort")
def is_expected_active_cohort_present(cohort_name: str):
    is_expected_active_cohort_present = APP.cohort_bar.is_expected_active_cohort_present(cohort_name)
    assert is_expected_active_cohort_present, f"The expected active cohort '{cohort_name}' is NOT active"

@step("Switch cohort to <cohort_name> from the Cohort Bar dropdown list")
def select_cohort_from_dropdown(cohort_name: str):
    click_button_on_cohort_bar("Switch")
    APP.cohort_bar.select_cohort_from_dropdown(cohort_name)

@step("Set as current cohort")
def set_as_current_cohort_from_temp_message():
    APP.cohort_bar.click_set_as_current_cohort_from_temp_message()

@step("The secondary Cohort Bar save screen should appear")
def is_secondary_cohort_bar_save_screen_present():
    is_second_save_modal_present = APP.cohort_bar.is_secondary_cohort_bar_save_screen_present()
    assert is_second_save_modal_present, f"The secondary save modal is NOT present"

@step("The cohort <cohort_name> should not appear in the cohort dropdown list")
def validate_cohort_is_not_present_in_dropdown(cohort_name: str):
    click_button_on_cohort_bar("Switch")
    is_cohort_visible = APP.cohort_bar.is_cohort_visible_in_dropdown_list(cohort_name)
    click_button_on_cohort_bar("Switch")
    assert not is_cohort_visible, f"The cohort '{cohort_name}' is visible in the dropdown when it should not be"

@step("The cohort <cohort_name> should appear in the cohort dropdown list")
def validate_cohort_is_present_in_dropdown(cohort_name: str):
    click_button_on_cohort_bar("Switch")
    is_cohort_visible = APP.cohort_bar.is_cohort_visible_in_dropdown_list(cohort_name)
    click_button_on_cohort_bar("Switch")
    assert is_cohort_visible, f"The cohort '{cohort_name}' is NOT visible in the dropdown when it should be"

@step("Validate the cohort query filter area has these filters <table>")
def validate_cohort_query_filters(table):
    for k, v in enumerate(table):
        is_cohort_filter_query_visible = APP.cohort_bar.is_cohort_query_filter_present(v[0],v[1],v[2])
        assert is_cohort_filter_query_visible, f"The filter '{v[0]}', with values '{v[1]}' is NOT present in the cohort query filter area"

@step("Validate the cohort query filter does not have these filters <table>")
def validate_cohort_query_filters(table):
    for k, v in enumerate(table):
        is_cohort_filter_query_visible = APP.cohort_bar.is_cohort_query_filter_not_present(v[0],v[1])
        assert is_cohort_filter_query_visible==False, f"The filter '{v[0]}', with values '{v[1]}' IS present in the cohort query filter area when it should not be"
