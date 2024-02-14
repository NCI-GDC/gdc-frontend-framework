import time
import random

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

@step("Create and save a cohort named <cohort_name> with these filters <table>")
def create_save_cohort_with_specified_filters(cohort_name, table):
    """
    create_save_cohort_with_specified_filters A condensed test step to create
    and save a cohort with specified filters.

    :param cohort_name: The name given to the new cohort
    :param v[0]: The tab of the filter to be selected
    :param v[1]: The filter card that will be used
    :param v[2]: The filter to select
    """
    APP.cohort_bar.click_cohort_bar_button("add")
    time.sleep(1)
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
    APP.shared.wait_for_loading_spinner_to_detatch()

    for k, v in enumerate(table):
        # Clicks tab in cohort builder
        APP.cohort_builder_page.click_button(v[0])
        time.sleep(1)
        APP.shared.wait_for_loading_spinner_to_detatch()
        # Expands list of filters to select if possible
        if APP.cohort_builder_page.is_show_more_or_show_less_button_visible_within_filter_card(v[1], "plus-icon"):
            APP.cohort_builder_page.click_show_more_less_within_filter_card(v[1], "plus-icon")
        # Selects desired filter
        APP.cohort_builder_page.make_selection_within_facet_group(v[1], v[2])
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        time.sleep(0.1)

    # After filters have been added, save the cohort
    APP.cohort_bar.click_cohort_bar_button("Save")
    APP.shared.click_text_option_from_dropdown_menu("Save")
    APP.shared.send_text_into_search_bar(cohort_name, "Input field for new cohort name")
    APP.shared.click_button_in_modal_with_displayed_text_name("Save")
    APP.cohort_bar.wait_for_text_in_temporary_message("Cohort has been saved", "Remove Modal")
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
    time.sleep(2)

@step("Create and save cohorts with randomly assigned filters <table>")
def create_save_cohort_with_random_filters(table):
    """
    create_save_cohort_with_random_filters A condensed test step to create
    and save a cohort with randomized filters.

    :param v[0]: Name given to the new cohort
    :param v[1]: Number of random filters to apply
    """
    number_of_tabs = APP.cohort_builder_page.get_number_of_tabs_in_cohort_builder()
    # Loop through the number of cohorts to create, edit, and save
    for k, v in enumerate(table):
        APP.cohort_bar.click_cohort_bar_button("add")
        time.sleep(1)
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        APP.shared.wait_for_loading_spinner_to_detatch()

        tabs_to_exclude = []
        number_of_filters_to_add_in_total = int(v[1])
        number_of_successful_filters_added = 0
        while (len(tabs_to_exclude) < number_of_tabs-1) and (number_of_successful_filters_added < number_of_filters_to_add_in_total):
            print("Figures:")
            print(len(tabs_to_exclude))
            print(number_of_tabs-1)
            print(number_of_successful_filters_added)
            print(number_of_filters_to_add_in_total)
            found_acceptable_tab_to_try_next = False
            random_tab_to_select = None
            # Find a tab to try that is not in the excluded list
            while not found_acceptable_tab_to_try_next:
                # random.range is inclusive at start and exclusive at stop.
                # That is fine, we do not want to select the last tab (Custom Filters)
                random_tab_to_select = random.randrange(1,number_of_tabs,1)
                if random_tab_to_select not in tabs_to_exclude:
                    found_acceptable_tab_to_try_next = True

            # Clicks tab in cohort builder
            APP.cohort_builder_page.click_tab_by_position_in_cohort_builder(random_tab_to_select)
            time.sleep(1)
            APP.shared.wait_for_loading_spinner_to_detatch()

            # Gets number of facet cards on the current tab
            number_of_facet_cards_on_current_tab = APP.cohort_builder_page.get_number_of_facet_cards_on_current_tab_in_cohort_builder()

            # random.range is inclusive at start and exclusive at stop.
            random_facet_to_select = random.randrange(1,number_of_facet_cards_on_current_tab+1,1)

            # Determine if facet card is able to be selected.
            # Criteria: Has checkboxes, has available data to be selected
            is_facet_able_to_be_selected = APP.cohort_builder_page.is_facet_card_able_to_select_by_position(random_facet_to_select)
            if is_facet_able_to_be_selected:
                number_of_filters_on_selected_facet_card = APP.cohort_builder_page.get_number_of_filters_on_facet_card_by_position(random_facet_to_select)
                # random.range is inclusive at start and exclusive at stop.
                random_filter_to_select = random.randrange(1,number_of_filters_on_selected_facet_card+1,1)
                APP.cohort_builder_page.click_filter_by_position_on_facet_card_by_position(random_facet_to_select,random_filter_to_select)
                APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
                time.sleep(0.1)
                # Successfully added a filter, counter goes up
                number_of_successful_filters_added = number_of_successful_filters_added + 1
            # If the facet has not filters to be selected, we try another tab
            else:
                # Exclude current tab from future consideration
                tabs_to_exclude.append(random_tab_to_select)

        # After filters have been added, save the cohort
        APP.cohort_bar.click_cohort_bar_button("Save")
        APP.shared.click_text_option_from_dropdown_menu("Save")
        APP.shared.send_text_into_search_bar(v[0], "Input field for new cohort name")
        APP.shared.click_button_in_modal_with_displayed_text_name("Save")
        APP.cohort_bar.wait_for_text_in_temporary_message("Cohort has been saved", "Remove Modal")
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        time.sleep(2)

@step("<button_name> should be <enabled_or_disabled> in the Cohort Bar")
def button_should_be_disabled_or_enabled_on_cohort_bar(button_name: str, enabled_or_disabled:str):
    enabled_or_disabled = enabled_or_disabled.lower()
    is_button_disabled = None
    # For the save button, the text in the dropdown will be what is disabled
    if button_name.lower() in ["save", "save as"]:
        APP.cohort_bar.click_cohort_bar_button("save")
        is_button_disabled = APP.cohort_bar.is_dropdown_option_text_button_disabled(button_name)
        APP.cohort_bar.click_cohort_bar_button("save")
    # Otherwise, for all other cohort bar buttons, the buttons themselves will what is disabled
    else:
        is_button_disabled = APP.cohort_bar.is_cohort_bar_button_disabled(button_name)
    # Assert if the button should be enabled or disabled based on test input
    if enabled_or_disabled == "enabled":
        assert is_button_disabled==False, f"The cohort bar button '{button_name}' is disabled when it should NOT be"
    elif enabled_or_disabled == "disabled":
        assert is_button_disabled, f"The cohort bar button {button_name} is enabled when it should NOT be"

@step("<cohort_name> should be the active cohort")
def is_expected_active_cohort_present(cohort_name: str):
    is_expected_active_cohort_present = APP.cohort_bar.is_expected_active_cohort_present(cohort_name)
    assert is_expected_active_cohort_present, f"The expected active cohort '{cohort_name}' is NOT active"

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
    assert not is_cohort_visible, f"The cohort '{cohort_name}' is visible in the dropdown when it should not be"

@step("The cohort <cohort_name> should appear in the cohort dropdown list")
def validate_cohort_is_present_in_dropdown(cohort_name: str):
    click_button_on_cohort_bar("Switch")
    is_cohort_visible = APP.cohort_bar.is_cohort_visible_in_dropdown_list(cohort_name)
    click_button_on_cohort_bar("Switch")
    assert is_cohort_visible, f"The cohort '{cohort_name}' is NOT visible in the dropdown when it should be"

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
        is_cohort_filter_query_visible = APP.cohort_bar.is_cohort_query_filter_present(v[0],v[1],v[2])
        assert is_cohort_filter_query_visible, f"The filter '{v[0]}', with values '{v[1]}' is NOT present in the cohort query filter area"

@step("Validate the cohort query filter does not have these filters <table>")
def validate_cohort_query_filters(table):
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
    APP.shared.wait_for_loading_spinner_to_detatch()
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    for k, v in enumerate(table):
        is_cohort_filter_query_visible = APP.cohort_bar.is_cohort_query_filter_not_present(v[0],v[1])
        assert is_cohort_filter_query_visible==False, f"The filter '{v[0]}', with values '{v[1]}' IS present in the cohort query filter area when it should not be"
