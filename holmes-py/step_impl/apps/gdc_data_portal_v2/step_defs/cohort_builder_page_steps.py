import time

from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Make the following selections from <tab_name> tab on the Cohort Builder page <table>")
def make_cohort_builder_selections(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.make_selection_within_facet_group(v[0], v[1])
        time.sleep(0.1)

@step("Enter text <text_to_send> in the search bar on the Cohort Builder page")
def enter_text_into_search_bar(text_to_send: str):
    APP.cohort_builder_page.send_text_into_search_bar(text_to_send)

@step("Expected result <expected_text> in the search bar on the Cohort Builder page")
def validate_search_bar_result_text(expected_text: str):
    is_expected_text_present = APP.cohort_builder_page.validate_search_bar_result(expected_text)
    assert is_expected_text_present, f"The expected search bar result text '{expected_text}' is NOT present"
    time.sleep(0.1)

@step("Click on the search bar result and validate the presence of correct facet card <table>")
def check_for_facet_card_without_navigating(table):
    for k, v in enumerate(table):
        APP.cohort_builder_page.click_on_search_bar_result(v[0])
        time.sleep(0.1)
        is_facet_visible = APP.cohort_builder_page.check_facet_card_presence(v[1])
        assert is_facet_visible, f"The facet card '{v[1]}' is NOT visible"
        time.sleep(0.1)

@step("Add a custom filter from <tab_name> tab on the Cohort Builder page <table>")
def add_custom_filter_card(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.add_custom_filter(v[0])

@step("Validate presence of facet cards on the <tab_name> tab on the Cohort Builder page <table>")
def make_cohort_builder_selections(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        is_facet_visible = APP.cohort_builder_page.check_facet_card_presence(v[0])
        assert is_facet_visible, f"In tab '{tab_name}', the facet card '{v[0]}' is NOT visible"
        time.sleep(0.1)
