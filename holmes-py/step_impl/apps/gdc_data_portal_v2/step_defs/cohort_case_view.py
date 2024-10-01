from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver
from getgauge.python import data_store

import time

@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Expand or collapse the cohort bar")
def click_expand_collapse_cohort_bar():
     """Expands or Collapses the Cohort Bar"""
     APP.cohort_case_view_page.click_expand_collapse_cohort_bar()

@step("Go to tab <tab_name> in Cohort Case View")
def click_tab_name(tab_name:str):
     """Clicks tab name"""
     APP.cohort_case_view_page.click_tab_name(tab_name)


@step("Verify presence of filter cards in Cohort Case View <table>")
def verify_filter_cards_presence(table):
    for k, v in enumerate(table):
        is_filter_visible = APP.cohort_case_view_page.is_filter_card_present(v[0])
        assert (
            is_filter_visible
        ), f"In Cohort Case View, the filter card '{v[0]}' is NOT visible"
        time.sleep(0.1)

@step(
    "Collect case counts for the following filters in Cohort Case View for cohort <cohort_name> <table>"
)
def collect_case_counts_on_filters(cohort_name: str, table):
    """
    collect_case_counts_on_filters Collect case count on filters on the cohort builder page.
    Pairs with the test 'verify_compared_statistics_are_equal_or_not_equal'.
    :param cohort_name: Cohort Name we are collecting the information under
    :param v[0]: filter Card Name
    :param v[1]: Filter we are collecting case count info on
    """
    for k, v in enumerate(table):
        # Switch to Selection view if possible
        if APP.cohort_case_view_page.is_aria_label_present_within_filter_card(v[0], "Selection view"):
            APP.cohort_builder_page.perform_action_within_filter_card(v[0], "Selection view")

        # Expands list of filters to select if possible
        if APP.cohort_case_view_page.is_show_more_or_show_less_button_visible_within_filter_card(
            v[0], "plus-icon"
        ):
            APP.cohort_case_view_page.click_show_more_less_within_filter_card(
                v[0], "plus-icon"
            )

        case_count = (
            APP.cohort_case_view_page.get_filter_selection_count(
                v[0], v[1]
            )
        )
        # Saves the case count under the filter, filter and cohort name
        data_store.spec[f"{v[0]}_{v[1]}_{cohort_name} Count"] = case_count

@step("Make the following selections on a filter card in Cohort Case View <table>")
def filter_card_selections(table):
    """Trio of actions for the filter cards and filters on the projects page"""
    for k, v in enumerate(table):
        # Switch to Selection view if possible
        if APP.cohort_case_view_page.is_aria_label_present_within_filter_card(v[0], "Selection view"):
            APP.cohort_case_view_page.perform_action_within_filter_card(v[0], "Selection view")

        # Expands list of filters to select if possible
        if APP.cohort_case_view_page.is_show_more_or_show_less_button_visible_within_filter_card(
            v[0], "plus-icon"
        ):
            APP.cohort_case_view_page.click_show_more_less_within_filter_card(v[0], "plus-icon")
        APP.cohort_case_view_page.make_selection_within_filter_group(v[0], v[1])
        APP.shared.wait_for_loading_spinners_to_detach()
        time.sleep(0.1)

@step("Perform the following actions on a filter card in Cohort Case View <table>")
def perform_filter_card_action(table):
    for k, v in enumerate(table):
        APP.cohort_case_view_page.perform_action_within_filter_card(v[0], v[1])
        APP.shared.wait_for_loading_spinners_to_detach()
        time.sleep(0.1)

@step("Expand or contract a filter in Cohort Case View <table>")
def click_show_more_or_show_less(table):
    for k, v in enumerate(table):
        APP.cohort_case_view_page.click_show_more_less_within_filter_card(v[0], v[1])
