from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

class MutationFrequencyLocators:
    BUTTON_GENE_MUTATION_TAB = lambda tab_name: f'[data-testid="button-{tab_name}-tab"]'
    BUTTON_CUSTOM_FILTER = lambda button_name: f'[data-testid="button-{button_name}"]'

    MODAL_ADD_CUSTOM_FILTER = 'label:has-text("Type or copy-and-paste a list of") >> .. >> .. >> .. >> .. >> .. >> .. >> ..'

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

    def click_custom_filter_button(self, button_name):
        button_locator = MutationFrequencyLocators.BUTTON_CUSTOM_FILTER(button_name)
        self.click(button_locator)

    def click_custom_filter_import_browse(self, button_text_name:str):
        """
        After add custom filter button has been clicked, we make sure the correct modal has loaded.
        Then, we click the 'browse' button to open the file explorer.
        """
        self.wait_until_locator_is_visible(MutationFrequencyLocators.MODAL_ADD_CUSTOM_FILTER)
        # It does not click the 'browse' button without force parameter set to 'True'
        self.click(GenericLocators.BUTTON_BY_DISPLAYED_TEXT(button_text_name), force = True)
