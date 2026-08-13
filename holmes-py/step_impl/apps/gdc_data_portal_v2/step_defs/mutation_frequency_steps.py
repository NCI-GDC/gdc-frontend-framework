from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)


@step("Switch to <tab_name> tab in the Mutation Frequency app")
def switch_tabs(tab_name: str):
    APP.mutation_frequency_page.click_gene_or_mutation_tab(tab_name)


@step("Select <button_name> in the Mutation Frequency app")
def click_mutation_frequency_button(button_name: str):
    APP.shared.wait_for_loading_spinner_to_detatch()
    APP.shared.wait_for_loading_spinner_table_to_detatch()
    APP.mutation_frequency_page.click_custom_filter_button(button_name)

@step("Search mutations for Gene symbol <gene_symbol>")
def click_search_for_mutations_in_gene_table(gene_symbol: str):
    APP.mutation_frequency_page.click_mutations_filter_table_button(gene_symbol)
    APP.shared.wait_for_loading_spinners_to_detach()
