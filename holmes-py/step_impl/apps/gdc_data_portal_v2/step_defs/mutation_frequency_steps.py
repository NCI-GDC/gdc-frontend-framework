from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Switch to <tab_name> tab in the Mutation Frequency app")
def name_cohort(tab_name: str):
    APP.mutation_frequency_page.click_gene_or_mutation_tab(tab_name)
