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

@step("Click the following radio buttons from <tab_name> tab on the Cohort Builder page <table>")
def click_radio_buttons(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.click_radio_button(v[0], v[1])
        time.sleep(0.1)

@step("Is checkbox checked from <tab_name> tab on the Cohort Builder page <table>")
def is_checkbox_checked(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        is_checkbox_enabeled = APP.cohort_builder_page.is_checkbox_checked(v[0], v[1])
        assert is_checkbox_enabeled == True, f"In facet '{v[0]}', the value '{v[1]}' is NOT checked"
        time.sleep(0.1)

@step("Is checkbox not checked from <tab_name> tab on the Cohort Builder page <table>")
def is_checkbox_not_checked(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        is_checkbox_disabeled = APP.cohort_builder_page.is_checkbox_checked(v[0], v[1])
        assert is_checkbox_disabeled == False, f"In facet '{v[0]}', the value '{v[1]}' IS checked when it is unexpected"
        time.sleep(0.1)

@step("Perform the following actions from <tab_name> tab on the Cohort Builder page <table>")
def perform_filter_card_action(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.perform_action_within_filter_card(v[0], v[1])
        time.sleep(0.1)

@step("Enter text in a filter card from <tab_name> tab on the Cohort Builder page <table>")
def search_in_filter_card(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.send_text_keys(v[0], v[1], v[2])
        time.sleep(0.1)

@step("Click the show more or show less button from <tab_name> tab on the Cohort Builder page <table>")
def click_show_more_or_show_less(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.click_show_more_less_within_filter_card(v[0], v[1])
        time.sleep(0.1)

@step("Click the following objects from <tab_name> tab on the Cohort Builder page <table>")
def click_named_object(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.click_named_item_in_facet_group(v[0], v[1])
        time.sleep(0.1)

@step("Add a custom filter card from from <tab_name> tab on the Cohort Builder page <table>")
def add_custom_filter_card(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.add_custom_filter(v[0])
        time.sleep(0.1)

@step("Add a custom filter from <tab_name> tab on the Cohort Builder page <table>")
def add_custom_filter_card(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        APP.cohort_builder_page.add_custom_filter(v[0])
        time.sleep(0.1)
