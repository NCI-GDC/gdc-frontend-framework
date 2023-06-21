from playwright.sync_api import Page

from ....base.base_page import BasePage


class MutationFrequencyLocators:
    BUTTON_GENE_MUTATION_TAB = lambda tab_name: f'[data-testid="button-{tab_name}-tab"]'

class MutationFrequencyPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=MutationFrequencyApp".format(url)
        self.driver = driver  # driver is PW page
        super().__init__(self.driver)

    def visit(self):
        self.driver.goto(self.URL)

    def click_gene_or_mutation_tab(self, tab_name):
        tab_name = tab_name.lower()
        tab = MutationFrequencyLocators.BUTTON_GENE_MUTATION_TAB(tab_name)
        self.click(tab)
