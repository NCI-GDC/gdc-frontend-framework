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

@step("Validate presence of facet cards on the <tab_name> tab on the Cohort Builder page <table>")
def make_cohort_builder_selections(tab_name: str, table):
    APP.cohort_builder_page.click_button(tab_name)
    for k, v in enumerate(table):
        is_facet_visible = APP.cohort_builder_page.check_facet_card_presence(v[0])
        assert is_facet_visible, f"In tab '{tab_name}', the facet card '{v[0]}' is NOT visible"
        time.sleep(0.1)
