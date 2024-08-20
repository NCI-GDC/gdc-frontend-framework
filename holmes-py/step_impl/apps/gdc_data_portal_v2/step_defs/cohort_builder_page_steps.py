import time

from getgauge.python import step, before_spec, data_store

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)


@step(
    "Make the following selections from <tab_name> tab on the Cohort Builder page <table>"
)
def make_cohort_builder_selections(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.make_selection_within_facet_group(v[0], v[1])
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        time.sleep(0.1)


@step("Make the following selections on the Cohort Builder page without pauses <table>")
def select_cohort_builder_filters_without_pauses(table):
    for k, v in enumerate(table):
        APP.cohort_builder_page.click_button(v[0])
        # This is for the filter card loading spinner, not the cohort bar. This needs to go away
        # before a filter could be selected anyway. We do this so we can check for a plus-icon before
        # attempting to add a filter.
        APP.shared.wait_for_loading_spinner_to_detatch()
        if APP.cohort_builder_page.is_show_more_or_show_less_button_visible_within_filter_card(
            v[1], "plus-icon"
        ):
            APP.cohort_builder_page.click_show_more_less_within_filter_card(
                v[1], "plus-icon"
            )
        APP.cohort_builder_page.make_selection_within_facet_group(v[1], v[2])
        time.sleep(0.1)


@step(
    "Perform the following actions from <tab_name> tab on the Cohort Builder page <table>"
)
def perform_filter_card_action(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.perform_action_within_filter_card(v[0], v[1])
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        time.sleep(0.1)


@step("Expected result <expected_text> in the search bar on the Cohort Builder page")
def validate_search_bar_result_text(expected_text: str):
    is_expected_text_present = APP.cohort_builder_page.validate_search_bar_result(
        expected_text
    )
    assert (
        is_expected_text_present
    ), f"The expected search bar result text '{expected_text}' is NOT present"
    time.sleep(0.1)


@step(
    "Select search bar result and validate the presence of correct facet card <table>"
)
def check_for_facet_card_without_navigating(table):
    for k, v in enumerate(table):
        APP.cohort_builder_page.click_on_search_bar_result(v[0])
        time.sleep(0.1)
        is_facet_visible = APP.cohort_builder_page.check_facet_card_presence(v[1])
        assert is_facet_visible, f"The facet card '{v[1]}' is NOT visible"


@step("Search in a filter card from <tab_name> tab on the Cohort Builder page <table>")
def search_in_filter_card(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.type_in_facet_search_text_area(v[0], v[1], v[2])
        time.sleep(0.1)


@step(
    "Expand or contract a facet from <tab_name> tab on the Cohort Builder page <table>"
)
def click_show_more_or_show_less(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.click_show_more_less_within_filter_card(v[0], v[1])
        time.sleep(0.1)


@step(
    "Select the following labels from <tab_name> tab on the Cohort Builder page <table>"
)
def click_named_object(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.click_named_item_in_facet_group(v[0], v[1])
        time.sleep(0.1)


@step(
    "Collect case counts for the following filters on the Cohort Builder page for cohort <cohort_name> <table>"
)
def collect_case_counts_on_filters(cohort_name: str, table):
    """
    collect_case_counts_on_filters Collect case count on filters on the cohort builder page.
    Pairs with the test 'verify_compared_statistics_are_equal_or_not_equal'.
    :param cohort_name: Cohort Name we are collecting the information under
    :param v[0]: Tab to select on cohort builder
    :param v[1]: Facet Card Name
    :param v[2]: Filter we are collecting case count info on
    """
    for k, v in enumerate(table):
        # Clicks tab in cohort builder
        APP.cohort_builder_page.click_button(v[0])
        time.sleep(1)
        APP.shared.wait_for_loading_spinner_to_detatch()

        # Expands list of filters to select if possible
        if APP.cohort_builder_page.is_show_more_or_show_less_button_visible_within_filter_card(
            v[1], "plus-icon"
        ):
            APP.cohort_builder_page.click_show_more_less_within_filter_card(
                v[1], "plus-icon"
            )

        case_count = (
            APP.cohort_builder_page.get_case_count_from_filter_within_facet_group(
                v[1], v[2]
            )
        )
        # Saves the case count under the facet, filter and cohort name
        data_store.spec[f"{v[1]}_{v[2]}_{cohort_name} Count"] = case_count


@step("Add a custom filter from <tab_name> tab on the Cohort Builder page <table>")
def add_custom_filter_card(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.add_custom_filter(v[0])
        time.sleep(0.1)


@step("This text is expected in the cohort query expression area <table>")
def check_text_in_cohort_query_expression(table):
    for k, v in enumerate(table):
        is_query_expression_area_text_present = (
            APP.cohort_builder_page.is_query_expression_area_text_present(v[0])
        )
        assert (
            is_query_expression_area_text_present
        ), f"The text '{v[0]}' is NOT present in the Query Expression Area"


@step(
    "Validate presence of facet cards on the <tab_name> tab on the Cohort Builder page <table>"
)
def make_cohort_builder_selections(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        is_facet_visible = APP.cohort_builder_page.check_facet_card_presence(v[0])
        assert (
            is_facet_visible
        ), f"In tab '{tab_name}', the facet card '{v[0]}' is NOT visible"
        time.sleep(0.1)

@step("Validate expected custom filters are present in facet cards on the <tab_name> tab on the Cohort Builder page <table>")
def make_cohort_builder_selections(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        is_custom_filter_visible = APP.cohort_builder_page.is_facet_card_custom_filter_text_present(v[0], v[1])
        assert is_custom_filter_visible, f"In tab '{tab_name}' and facet card '{v[0]}', the custom filter text '{v[1]}' is NOT visible"
        time.sleep(0.1)


@step("Navigate to the <tab_name> tab on the Cohort Builder page")
def click_cohort_builder_tab(tab_name: str):
    APP.cohort_builder_page.click_button(tab_name)


@step("Only show custom case filters with values")
def click_show_only_properties_with_values_checkbox():
    APP.cohort_builder_page.click_only_show_properties_with_values_checkbox()
