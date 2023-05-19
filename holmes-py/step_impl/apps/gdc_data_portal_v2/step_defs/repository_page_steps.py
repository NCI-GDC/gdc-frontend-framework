import time

from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Select <button_name> on the Repository page")
def select_repository_page_button(button_name: str):
    APP.repository_page.click_repository_page_button(button_name)

@step("Select <button_name> on the Image Viewer page")
def select_repository_page_button(button_name: str):
    APP.repository_page.click_image_viewer_page_data_testid(button_name)

@step("Select file filter, <filter_name>, nth: <nth>")
def select_file_filter_and_validate(filter_name: str, nth: int):
    repository = APP.repository_page
    try:
        repository.click_button(filter_name)
    except:
        repository.select_nth_file_filters_result(int(nth) - 1)

@step("Verify that the following default filters are displayed in order <table>")
def default_filters(table):
    repository = APP.repository_page
    actual_filters_order = repository.get_filter_facet_names()
    expected_default_filters_in_order = []
    for row, value in enumerate(table):
        expected_default_filters_in_order += value
    assert (
        len(actual_filters_order) == len(expected_default_filters_in_order)
        and actual_filters_order == expected_default_filters_in_order
    ), (
        f"Default filters sizes do not match with expected or they are"
        f" not displayed in order.\nActual: {actual_filters_order}"
        f"\nExpected: {expected_default_filters_in_order}"
    )


@step("Verify <count> items on Add a File Filter filter list")
def verify_file_filter_list_count(count: int):
    actual_count = APP.repository_page.get_file_filter_list_count()
    assert (
        int(count) == actual_count
    ), f"Add a File Filters list count mismatch.\nExpected: {count}\nActual: {actual_count}"


@step("Verify file filter names do not start with <pattern>")
def verify_file_filter_names_are_appropriate(pattern):
    file_filter_names = APP.repository_page.get_file_filter_names()
    fails = []
    for name in file_filter_names:
        if name.startswith(pattern):
            fails.append({name: name.startswith(pattern)})
    assert (
        not fails
    ), f"Some files are starting with `{pattern}`!\nFilter names: {fails}"

@step("Verify that the file filter, <filter_name>, has been applied")
def verify_file_filter_applied(filter_name: str):
    repository = APP.repository_page
    expected_filter_name = repository.get_custom_filter_facet_as_applied(filter_name)
    actual_filter_name = repository.get_filter_facet_names()[0]
    assert (
        expected_filter_name == actual_filter_name
    ), f"Custom filter not found in facets.\nExpected: {expected_filter_name}\nActual: {actual_filter_name}"

@step("Verify the slide image is visible")
def verify_slide_image_is_visible():
    is_slide_image_visible = APP.repository_page.is_slide_image_visible()
    assert is_slide_image_visible, f"The slide image is NOT visible"

@step("Verify the slide image viewer is showing <number_of_cases> cases")
def verify_slide_image_viewer_case_count(number_of_cases):
    showing_cases_slide_image_text = APP.repository_page.get_image_viewer_showing_cases_text()
    assert f"Showing {number_of_cases}" in showing_cases_slide_image_text, f"The slide image viewer page is not showing expected number of cases - {number_of_cases}"

@step("Verify details fields and values <table>")
def verify_details_fields_and_values(table):
    """On a slide image, details pop-up, verifies that given fields and values are present"""
    for k, v in enumerate(table):
         field_present = APP.repository_page.is_detail_field_present(v[0])
         assert field_present, f"Expected field '{v[0]}' is NOT present in details section"
         value_present = APP.repository_page.is_detail_value_present(v[0],v[1])
         assert value_present, f"Expected value '{v[1]}' for field '{v[0]}' is NOT present in details section"

@step("Search for file filter, <filter_name>")
def search_for_filter_and_searchbox_content(filter_name: str):
    APP.repository_page.search_file_filters(filter_name)
    search_box_content = APP.repository_page.get_search_box_entry()
    assert (
        filter_name == search_box_content
    ), f"Expected value not found in search box entry.\nExpected: {filter_name}\nActual: {search_box_content}"

@step("Search for <image_viewer_search> on the Image Viewer page")
def search_image_viewer(image_viewer_search: str):
    APP.repository_page.search_image_viewer(image_viewer_search)

@step("Remove search filter <search_filter> on the Image Viewer page")
def remove_slide_image_viewer_search_filter(search_filter: str):
    APP.repository_page.remove_slide_image_viewer_search_filter(search_filter)

@step("Make the following selections on a filter card on the Repository page <table>")
def filter_card_selections(table):
    """Trio of actions for the filter cards and filters on the repository page"""
    for k, v in enumerate(table):
        APP.repository_page.make_selection_within_facet_group(v[0], v[1])

@step("Perform the following actions on a filter card on the Repository page <table>")
def perform_filter_card_action(table):
    for k, v in enumerate(table):
        APP.repository_page.perform_action_within_filter_card(v[0], v[1])

@step("Expand or contract a filter on the Repository page <table>")
def click_show_more_or_show_less(table):
    for k, v in enumerate(table):
        APP.repository_page.click_show_more_less_within_filter_card(v[0], v[1])
