import json
import tarfile
import time
import re

from datetime import datetime as dt

from getgauge.python import step, before_spec, after_spec, data_store

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver
from ....base.utility import Utility



@step("Pause <sleep_time> seconds")
def pause_10_seconds(sleep_time):
    time.sleep(int(sleep_time))

@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@after_spec
def remove_active_cohort_filters():
    """
    After each spec file's execution, this function will run. The intention is to
    clear the active cohort filters to setup the next spec run.

    First, we check to see if there is the 'No filters currently applied' text is present.
    If not, we then check to see if we are on the analysis center page. If not,
    then we go to the analysis center. Then, we click the 'Clear All' button to remove
    the active cohort filters. Finally, we wait to see the the text confirming there
    are no active cohort filters present.
    """
    if not APP.shared.is_no_active_cohort_filter_text_present():
        if not APP.analysis_center_page.is_analysis_center_page_present():
            APP.analysis_center_page.visit()
            APP.header_section.wait_for_page_to_load("analysis")
        APP.shared.clear_active_cohort_filters()

@step("On GDC Data Portal V2 app")
def navigate_to_app():
    APP.navigate()
    APP.warning_modal.accept_warning()

@step("Go to <page_name> page")
def go_to_page(page_name):
    pages = {"Analysis": APP.analysis_center_page.visit()}
    pages[page_name]

@step("Navigate to <target> from <source> <target_type>")  # will have click actions
def navigate_to_page_in_page(target, source, target_type):
    sources = {
        "Header": {
            "section": APP.header_section.navigate_to_main_pages
        },
        "Home Page":{
            "app": APP.home_page.navigate_to_app
        },
        "Repository": {
            "app": APP.repository_page.click_button
        },
        "Analysis": {
            "app": APP.analysis_center_page.navigate_to_app
        },
        "Cohort Builder": {
            "app": APP.cohort_builder_page.click_button
        }
    }
    sources.get(source)[target_type](target)


@step("Verify that the <text> text is displayed on <source> <target_type>")
def verify_text_on_page(text, source, target_type):
    sources = {
        "Repository": {"app": APP.repository_page.get_title},
        "Add a File Filter": {"modal": APP.repository_page.get_text_on_modal},
    }
    first_text = text.split(" ")[0]
    try:
        text_value = sources.get(source)[target_type](text)
    except:
        text_value = sources.get(source)[target_type](first_text)
    assert (
        text == text_value
    ), f"Unexpected title detected: looking for {text}, but got {text_value}"

@step("Verify the <source> is <equal_or_not_equal> to the home page count for <home_page_category>")
def verify_counts_match_home_page_count(source, equal_or_not_equal, home_page_category):
    """
    verify_counts_match_home_page_count compares the specified home page statistic to another
    specified statistic somewhere else in the data portal. Asserts if they are equal
    or not equal based on spec file input.

    :param source: The function being executed to get a statistic somewhere in the data portal
    :param equal_or_not_equal: If the compared statistics should be equal or not
    :param home_page_category: Name of the home page category we are comparing with
    :return: N/A
    """
    sources = {
        "Cohort Bar Case Count": APP.shared.get_cohort_bar_case_count()
    }

    # Get the statistic from somewhere in the data portal
    count_from_page = sources.get(source)
    # Turn it into an 'int' for comparison
    count_from_page = count_from_page.replace(',', '')
    count_from_page_int = int(count_from_page)

    # From storage after previously running the test "store_home_page_data_portal_statistics"
    # Get the category statistic from the data portal summary on the home page
    count_from_home_page_statistics = data_store.spec[f"{home_page_category} count"]
    # Turn it into an 'int' for comparison
    count_from_home_page_statistics = count_from_home_page_statistics.replace(',', '')
    count_from_home_page_statistics_int = int(count_from_home_page_statistics)

    equal_or_not_equal = equal_or_not_equal.lower()
    if equal_or_not_equal == "equal":
        assert count_from_page_int == count_from_home_page_statistics_int, f"The {source} count '{count_from_page}' does NOT match the home page statistic '{count_from_home_page_statistics}'"
    elif equal_or_not_equal == "not equal":
        assert count_from_page_int != count_from_home_page_statistics_int, f"The {source} count '{count_from_page}' matches the home page statistic '{count_from_home_page_statistics}' when they should not"

@step("Close <modal_name> modal")
def close_modal(modal_name: str):
    modals = {"Add a File Filter": APP.repository_page.close_add_a_file_filter_modal}
    modals.get(modal_name)()
    assert (
        not APP.repository_page.get_file_filter_list_count()
    ), f"Modal is still open.\nModal name: {modal_name}"

@step("Close the modal")
def close_the_modal():
    APP.shared.click_close_modal_button()

@step("Download <file> from <source>")
def download_file_at_file_table(file:str, source:str):
    sources = {
        "Projects": APP.projects_page.click_button,
        "Repository": APP.repository_page.click_button,
        "File Summary": APP.file_summary_page.click_download_button,
        "Case Summary Biospecimen Supplement First File": APP.case_summary_page.click_biospecimen_supplement_file_first_download_button,
        "Cohort Bar": APP.cohort_bar.click_cohort_bar_button
    }
    driver = WebDriver.page
    with driver.expect_download(timeout=60000) as download_info:
        # Allows using sources without passing in contents of <file> as a parameter
        if file.lower() == "file":
            sources.get(source)()
        else:
            sources.get(source)(file)
    download = download_info.value
    file_path = f"{Utility.parent_dir()}/holmes-py/downloads/{dt.timestamp(dt.now())}_{download.suggested_filename}"
    download.save_as(file_path)
    data_store.spec[f"{file} from {source}"] = file_path

@step("Upload <file_name> <extension> from <folder_name> in <source> through <button>")
def upload_file(file_name:str, extension:str, folder_name:str, source:str, button:str):
    """
    upload_file performs an action to launch a file explorer,
    and then uploads a specified file located in the resources folder.

    :param file_name: The name of the file being uploaded
    :param extension: The extension of the file being uploaded
    :param folder_name: Name of the folder that contains the file being uploaded.
    :param source: Specifies what function is causing the action to launch the file explorer
    :param button: ID or Name of the button that is being clicked to launch the file explorer
    :return: N/A
    """
    sources = {
        "Cohort Bar Import": APP.cohort_bar.click_import_cohort_browse,
        "Mutation Frequency Custom Filter": APP.mutation_frequency_page.click_custom_filter_import_browse,
    }
    driver = WebDriver.page
    with driver.expect_file_chooser(timeout=60000) as file_chooser_info:
        # Allows using sources without passing in contents of <file> as a parameter
            sources.get(source)(button)
    file_chooser = file_chooser_info.value
    file_name = file_name.lower().replace(" ", "_")
    folder_name = folder_name.lower().replace(" ", "_")
    file_path = f"{Utility.parent_dir()}/holmes-py/resources/{folder_name}/{file_name}.{extension}"
    file_chooser.set_files(file_path)

@step("Read from <file_type>")
def read_from_file(file_type):
    with open(data_store.spec[file_type],'r+') as f:
        data_store.spec[f"{file_type} contents"] = f.read()

@step("Read file content from compressed <file_type>")
def read_file_content_from_compressed_file(file_type):
    """Used for tar.gz files. Typically seen with file or multiple file downloads"""
    tar = tarfile.open(data_store.spec[file_type],'r:gz')
    all_files_content = ""
    # Skips reading the metadata file
    for member in tar.getmembers()[1:]:
            f=tar.extractfile(member)
            single_file_content = f.read()
            all_files_content += str(single_file_content)
    data_store.spec[f"{file_type} contents"] = all_files_content

@step("Read metadata from compressed <file_type>")
def read_metadata_from_compressed_file(file_type):
    """Used for tar.gz files. Typically seen with file or multiple file downloads"""
    tar = tarfile.open(data_store.spec[file_type],'r:gz')
    tar_list = tar.getmembers()
    # The first 'member' is always the metadata file
    tar_list_metadata = tar.extractfile(tar_list[0])
    metadata_content = tar_list_metadata.read()
    data_store.spec[f"{file_type} contents"] = str(metadata_content)

@step("Verify that <file_type> has expected information <table>")
def verify_file_content(file_type, table):
    """Checks if specified information is inside collected content from read-in files"""
    for k, v in enumerate(table):
        assert v[0] in data_store.spec[f"{file_type} contents"], f"'{v[0]}' is NOT found in the file"

@step("Verify that <file_type> does not contain specified information <table>")
def verify_content_is_not_in_file(file_type, table):
    """Checks if specified information is NOT inside collected content from read-in files"""
    for k, v in enumerate(table):
        assert v[0] not in data_store.spec[f"{file_type} contents"], f"'{v[0]}' is found in the file when it's unexpected"

@step("Verify that the <file_type> has <field_name> for each object")
def verify_file_has_expected_field_names(file_type, field_name):
    fails = {}
    if "JSON" in file_type:
        if "annotations.annotation_id" in field_name: return
        json_arr = json.loads(data_store.spec[f"{file_type} contents"])
        field_names = field_name.split(".")
        for json_obj in json_arr:
            if len(field_names) > 1:
                Utility.validate_json_key_exists(Utility.flatten_json(json_obj),field_name, fails)
            elif "platform" in field_name:
                if not json_obj["data_format"] == "VCF" \
                    and not json_obj["data_format"] == "MAF" \
                    and not json_obj["data_format"] == "TSV":
                    Utility.validate_json_key_exists(json_obj, field_name, fails)
            elif "experimental_strategy" in field_name:
                if not json_obj["data_category"] == "Clinical" \
                    and not json_obj["data_category"] == "Biospecimen":
                    Utility.validate_json_key_exists(json_obj, field_name, fails)
            else:
                Utility.validate_json_key_exists(json_obj, field_name, fails)
    elif "TSV" in file_type:
        pass
    assert not fails, f"{file_type} validation failed!\nFails: {fails}"

@step("Verify presence of filter card <table>")
def make_cohort_builder_selections(table):
    for k, v in enumerate(table):
        is_filter_visible = APP.shared.is_filter_card_present(v[0])
        assert is_filter_visible, f"The filter card '{v[0]}' is NOT visible"

@step("Verify the page is showing <number_of_items_text>")
def verify_showing_item_text(number_of_items_text):
    """Verifies the 'Showing' text at the bottom of tables has the correct text"""
    showing_items_text = APP.shared.get_showing_count_text()
    assert f"{showing_items_text}" in showing_items_text, f"The page is NOT showing expected number of items - {number_of_items_text}"

@step("Verify the table header text is correct <table>")
def verify_table_header_text(table):
    """Verifies the table header has the correct text"""
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    for k, v in enumerate(table):
        table_header_text_by_column = APP.shared.get_table_header_text_by_column(v[1])
        # Remove new lines from input
        table_header_text_by_column = table_header_text_by_column.replace('\n', '')
        # Remove unwanted additional spaces between words from input
        table_header_text_by_column = re.sub(' +', ' ', table_header_text_by_column)
        assert f"{table_header_text_by_column}" == v[0], f"The table header column '{v[1]}' is showing text '{table_header_text_by_column}' when we expected text '{v[0]}'"

@step("Verify the table body text is correct <table>")
def verify_table_body_text(table):
    """Verifies the table body has the correct text"""
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    for k, v in enumerate(table):
        table_body_text_by_row_column = APP.shared.get_table_body_text_by_row_column(v[1],v[2])
        # Remove new lines from input
        table_body_text_by_row_column = table_body_text_by_row_column.replace('\n', '')
        # Remove unwanted additional spaces between words from input
        table_body_text_by_row_column = re.sub(' +', ' ', table_body_text_by_row_column)
        assert f"{table_body_text_by_row_column}" == v[0], f"The table body row '{v[1]}' and column '{v[2]}' is showing text '{table_body_text_by_row_column}' when we expected text '{v[0]}'"

@step("Verify the table body tooltips are correct <table>")
def verify_table_body_tooltips_text(table):
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    """Verifies the table body has correct tooltips"""
    for k, v in enumerate(table):
        APP.shared.hover_table_body_by_row_column(v[1],v[2])
        is_tooltip_text_present = APP.shared.is_text_present(v[0])
        assert is_tooltip_text_present, f"Hovering over table body row '{v[1]}' and column '{v[2]}' does NOT produce the tooltip '{v[0]}' as we expect"

@step("Wait for <data_testid> to be present on the page")
def wait_for_data_testid_to_be_visible_on_the_page(data_testid: str):
    """Waits for specified data-testid to be present on the page"""
    is_data_testid_visible = APP.shared.wait_for_data_testid_to_be_visible(data_testid)
    assert is_data_testid_visible, f"The data-testid '{data_testid}' is NOT present"

@step("Wait for loading spinner")
def wait_for_loading_spinner_generic_to_appear_then_disappear():
    """Waits for loading spinner to appear and disappear on the page"""
    APP.shared.wait_for_loading_spinner_to_be_visible()
    APP.shared.wait_for_loading_spinner_to_detatch()

@step("Wait for cohort bar case count loading spinner")
def wait_for_loading_spinner_cohort_bar_case_count_to_disappear():
    """Waits for cohort bar case count loading spinner to disappear on the page"""
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()

@step("Wait for table loading spinner")
def wait_for_loading_spinner_cohort_bar_case_count_to_disappear():
    """Waits for table loading spinner to disappear on the page"""
    APP.shared.wait_for_loading_spinner_table_to_detatch()

@step("Wait for table body text to appear <table>")
def wait_for_table_body_text_to_appear(table):
    """Waits for specified table body text to appear"""
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    for k, v in enumerate(table):
        """
        v[0] - Text
        v[1] - Row
        v[2] - Column
        """
        APP.shared.wait_for_table_body_text_by_row_column(v[0],v[1],v[2])

@step("Is text <expected_text> present on the page")
def is_text_present_on_the_page(expected_text: str):
    """Verifies if expected text is on the page"""
    is_text_present = APP.shared.is_text_present(expected_text)
    assert is_text_present, f"The text '{expected_text}' is NOT present"

@step("Is text <expected_text> not present on the page")
def is_text_present_on_the_page(expected_text: str):
    """Verifies if text is no longer on the page as expected"""
    is_text_not_present = APP.shared.is_text_not_present(expected_text)
    assert is_text_not_present, f"The text '{expected_text}' is present when it should not"

@step("Is modal with text <expected_text> present on the page and <action>")
def is_modal_text_present_on_the_page(expected_text: str, action: str):
    """Waits for modal with specified text and optionally removes modal"""
    is_text_present = APP.shared.wait_for_text_in_temporary_message(expected_text,action)
    assert is_text_present, f"The text '{expected_text}' is NOT present in a modal"

@step("Collect these data portal statistics for comparison <table>")
def store_home_page_data_portal_statistics(table):
     """
        Stores data portal summary statistics for use in future tests.
        Pairs with the test 'verify_counts_match_home_page_count'
     """
     for k, v in enumerate(table):
        category_statistic = APP.home_page.get_data_portal_summary_statistic(v[0])
        data_store.spec[f"{v[0]} count"] = category_statistic

@step("The cohort bar case count should be <case_count>")
def is_cohort_bar_case_count_present_on_the_page(case_count: str):
    """Checks the cohort bar case count"""
    is_case_count_present = APP.shared.is_cohort_bar_case_count_present(case_count)
    assert is_case_count_present, f"The cohort bar is NOT displaying '{case_count}' cases"

@step("The cart should have <correct_file_count> files")
def is_cart_count_correct(correct_file_count: str):
    """Checks the cart file count in the upper-right corner of the data portal"""
    is_cart_count_correct = APP.shared.is_cart_count_correct(correct_file_count)
    assert is_cart_count_correct, f"The cart count is NOT displaying '{correct_file_count}'"

@step("Is data-testid button <data_testid> not present on the page")
def is_data_testid_not_present_on_the_page(data_testid: str):
    is_data_testid_present = APP.shared.is_data_testid_present(data_testid)
    assert is_data_testid_present == False, f"The data-testid '{data_testid}' IS present"

@step("Is checkbox checked <table>")
def is_checkbox_checked(table):
    for k, v in enumerate(table):
        is_checkbox_enabeled = APP.shared.is_facet_card_enum_checkbox_checked(v[0])
        assert is_checkbox_enabeled, f"The checkbox '{v[0]}' is NOT checked"
        time.sleep(0.1)

@step("Is checkbox not checked <table>")
def is_checkbox_not_checked(table):
    for k, v in enumerate(table):
        is_checkbox_disabeled = APP.shared.is_facet_card_enum_checkbox_checked(v[0])
        assert is_checkbox_disabeled == False, f"The checkbox '{v[0]}' IS checked when it is unexpected"
        time.sleep(0.1)

@step("Select <data_testid> on page")
def click_data_testid(data_testid: str):
    """Clicks specified data-testid"""
    APP.shared.click_data_testid(data_testid)

@step("Select <data_testid> a data-testid button")
def click_button_with_data_testid(data_testid: str):
    """Clicks specified data-testid button"""
    APP.shared.click_button_data_testid(data_testid)

@step("Select <button_text_name>")
def click_button_with_displayed_text_name(button_text_name: str):
    """Selects a button based on displayed text"""
    APP.shared.click_button_with_displayed_text_name(button_text_name)

@step("Select the following radio buttons <table>")
def click_radio_buttons(table):
    for k, v in enumerate(table):
        APP.shared.click_radio_button(v[0])
        time.sleep(0.1)

@step("Select create or save in cohort modal")
def click_create_or_save_in_cohort_modal():
    """Clicks 'Create' or 'Save' in cohort modal"""
    APP.shared.click_create_or_save_button_in_cohort_modal()

@step("Select or deselect these options from the table column selector <table>")
def click_create_or_save_in_cohort_modal(table):
    """
    Clicks table column selector button.
    In the column selector pop-up modal that appears, it clicks the specified switch.
    """
    APP.shared.click_column_selector_button()
    for k, v in enumerate(table):
        APP.shared.click_switch_for_column_selector(v[0])
    APP.shared.click_column_selector_button()

@step("Clear active cohort filters")
def clear_active_cohort_filters():
    # Clicks the 'clear all' button in the cohort query area
    APP.shared.clear_active_cohort_filters()

@step("Undo Action")
def click_undo_in_message():
    """Clicks 'undo' in a modal message"""
    APP.shared.click_undo_in_message()

@step("Set this as your current cohort")
def click_undo_in_message():
    """Clicks 'Set this as your current cohort' in a modal message"""
    APP.shared.click_set_as_current_cohort_in_message()
    APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()

# These 3 functions are for filter cards (like on projects or repository page).
# The filter cards depend on a specific data-testid "filters-facets" that
# is common across a couple of filter sets in the data portal.
@step("Make the following selections on a filter card <table>")
def filter_card_selections(table):
    """Trio of actions for the filter cards and filters on the repository page"""
    for k, v in enumerate(table):
        APP.shared.make_selection_within_filter_group(v[0], v[1])
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        APP.shared.wait_for_loading_spinner_table_to_detatch()
        APP.shared.wait_for_loading_spinner_to_detatch()
        time.sleep(0.1)

@step("Perform the following actions on a filter card <table>")
def perform_filter_card_action(table):
    for k, v in enumerate(table):
        APP.shared.perform_action_within_filter_card(v[0], v[1])
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        APP.shared.wait_for_loading_spinner_table_to_detatch()
        APP.shared.wait_for_loading_spinner_to_detatch()
        time.sleep(0.1)

@step("Expand or contract a filter <table>")
def click_show_more_or_show_less(table):
    for k, v in enumerate(table):
        APP.shared.click_show_more_less_within_filter_card(v[0], v[1])


@step("Select value from table by row and column <table>")
def select_table_value_by_row_column(table):
    """
    Selects values from tables by giving a row and column
    Row and Column indexing begins at '1'
    """
    for k, v in enumerate(table):
        APP.shared.select_table_by_row_column(v[0],v[1])
        time.sleep(1)
        APP.shared.wait_for_loading_spinner_table_to_detatch()
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        APP.shared.wait_for_loading_spinner_table_to_detatch()
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()

@step("Enter text <text> in the <aria_label> search bar")
def send_text_into_search_bar(text: str, aria_label: str):
    """Sends text into search bar based on its aria_label"""
    APP.shared.send_text_into_search_bar(text, aria_label)

@step("Search the table for <text>")
def send_text_into_table_search_bar(text: str):
    """Sends text into a table search bar"""
    APP.shared.send_text_into_table_search_bar(text)
    time.sleep(1)
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.shared.keyboard_press("Enter")
    APP.shared.wait_for_loading_spinner_table_to_detatch()

@step("Quick search for <text> and go to its page")
def quick_search_and_click(text: str):
    """
    Sends text into the quick search bar in the upper-right corner of the data portal.
    Then clicks the result in the search result area. Best used with a UUID.
    """
    APP.shared.quick_search_and_click(text)

@step("Quick search for <text>")
def global_quick_search(text: str):
    """
    Sends text into the quick search bar in the upper-right corner of the data portal.
    """
    APP.shared.global_quick_search(text)

@step("Validate the quick search bar result in position <result_in_list> of the result list has the abbreviation <abbreviation>")
def validate_global_quick_search_result_abbreviation(result_in_list: str, abbreviation:str):
    """
    Specifies a result from the quick search bar result list. Validates the result abbreviation is the one we expect.
    """
    APP.shared.validate_global_quick_search_result_abbreviation(result_in_list,abbreviation)

@step("Select the quick search bar result in position <result_in_list>")
def quick_search(result_in_list: str):
    """
    Specifies a result from the quick search bar result list. Clicks that result.
    """
    APP.shared.click_global_quick_search_result(result_in_list)

@step("Name the cohort <cohort_name>")
def name_cohort(cohort_name: str):
    APP.shared.send_text_into_search_bar(cohort_name, "Input field for new cohort name")

@step("These links on the <page_name> should take the user to correct page in a new tab <table>")
def click_nav_item_check_text_in_new_tab(page_name: str, table):
    """
    Performs an action to open a new tab.
    Then, checks for expected text on the new tab to indicate it opened correctly.
    """
    for k, v in enumerate(table):
        new_tab = APP.shared.perform_action_handle_new_tab(page_name, v[0])
        is_text_visible = APP.shared.is_text_visible_on_new_tab(new_tab,v[1])
        assert is_text_visible, f"After click on '{v[0]}', the expected text '{v[1]}' in NOT present"
        new_tab.close()
