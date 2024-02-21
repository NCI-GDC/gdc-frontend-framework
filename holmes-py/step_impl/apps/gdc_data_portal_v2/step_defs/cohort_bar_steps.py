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
    # If saving the cohort, click the save button and select specified text from dropdown menu
    if button_name.lower() in ["save", "save as"]:
        APP.cohort_bar.click_cohort_bar_button("save")
        APP.cohort_bar.click_text_option_from_dropdown_menu(button_name)
    # Otherwise, just click the specified button on the cohort bar
    else:
        APP.cohort_bar.click_cohort_bar_button(button_name)
    time.sleep(0.5)


@step("Name the cohort <cohort_name> in the Cohort Bar section")
def name_cohort(cohort_name: str):
    APP.shared.send_text_into_search_bar(cohort_name, "Input field for new cohort name")


@step("<button_name> should be <enabled_or_disabled> in the Cohort Bar")
def button_should_be_disabled_or_enabled_on_cohort_bar(
    button_name: str, enabled_or_disabled: str
):
    enabled_or_disabled = enabled_or_disabled.lower()
    is_button_disabled = None
    # For the save button, the text in the dropdown will be what is disabled
    if button_name.lower() in ["save", "save as"]:
        APP.cohort_bar.click_cohort_bar_button("save")
        is_button_disabled = APP.cohort_bar.is_dropdown_option_text_button_disabled(
            button_name
        )
        APP.cohort_bar.click_cohort_bar_button("save")
    # Otherwise, for all other cohort bar buttons, the buttons themselves will what is disabled
    else:
        is_button_disabled = APP.cohort_bar.is_cohort_bar_button_disabled(button_name)
    # Assert if the button should be enabled or disabled based on test input
    if enabled_or_disabled == "enabled":
        assert (
            is_button_disabled == False
        ), f"The cohort bar button '{button_name}' is disabled when it should NOT be"
    elif enabled_or_disabled == "disabled":
        assert (
            is_button_disabled
        ), f"The cohort bar button {button_name} is enabled when it should NOT be"


@step("<cohort_name> should be the active cohort")
def is_expected_active_cohort_present(cohort_name: str):
    is_expected_active_cohort_present = (
        APP.cohort_bar.is_expected_active_cohort_present(cohort_name)
    )
    assert (
        is_expected_active_cohort_present
    ), f"The expected active cohort '{cohort_name}' is NOT active"


@step("Switch cohort to <cohort_name> from the Cohort Bar dropdown list")
def select_cohort_from_dropdown(cohort_name: str):
    click_button_on_cohort_bar("Switch")
    APP.cohort_bar.select_cohort_from_dropdown(cohort_name)
    time.sleep(2)
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
    APP.shared.wait_for_loading_spinner_to_detatch()
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()


@step("Set as current cohort")
def set_as_current_cohort_from_temp_message():
    APP.cohort_bar.click_set_as_current_cohort_from_temp_message()


@step("The cohort <cohort_name> should not appear in the cohort dropdown list")
def validate_cohort_is_not_present_in_dropdown(cohort_name: str):
    click_button_on_cohort_bar("Switch")
    is_cohort_visible = APP.cohort_bar.is_cohort_visible_in_dropdown_list(cohort_name)
    click_button_on_cohort_bar("Switch")
    assert (
        not is_cohort_visible
    ), f"The cohort '{cohort_name}' is visible in the dropdown when it should not be"


@step("The cohort <cohort_name> should appear in the cohort dropdown list")
def validate_cohort_is_present_in_dropdown(cohort_name: str):
    click_button_on_cohort_bar("Switch")
    is_cohort_visible = APP.cohort_bar.is_cohort_visible_in_dropdown_list(cohort_name)
    click_button_on_cohort_bar("Switch")
    assert (
        is_cohort_visible
    ), f"The cohort '{cohort_name}' is NOT visible in the dropdown when it should be"


@step("Remove these filters from the cohort query area <table>")
def remove_filters_from_cohort_query_filters(table):
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
    APP.shared.wait_for_loading_spinner_to_detatch()
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    for k, v in enumerate(table):
        APP.cohort_bar.click_remove_filter_from_cohort_query_area(v[0])
        APP.shared.wait_for_loading_spinner_table_to_detatch()
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        APP.shared.wait_for_loading_spinner_to_detatch()
        APP.shared.wait_for_loading_spinner_table_to_detatch()
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()


@step("Validate the cohort query filter area has these filters <table>")
def validate_cohort_query_filters(table):
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
    APP.shared.wait_for_loading_spinner_to_detatch()
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    for k, v in enumerate(table):
        is_cohort_filter_query_visible = APP.cohort_bar.is_cohort_query_filter_present(
            v[0], v[1], v[2]
        )
        assert (
            is_cohort_filter_query_visible
        ), f"The filter '{v[0]}', with values '{v[1]}' is NOT present in the cohort query filter area"


@step("Validate the cohort query filter does not have these filters <table>")
def validate_cohort_query_filters(table):
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
    APP.shared.wait_for_loading_spinner_to_detatch()
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    for k, v in enumerate(table):
        is_cohort_filter_query_visible = (
            APP.cohort_bar.is_cohort_query_filter_not_present(v[0], v[1])
        )
        assert (
            is_cohort_filter_query_visible == False
        ), f"The filter '{v[0]}', with values '{v[1]}' IS present in the cohort query filter area when it should not be"
