from playwright.sync_api import Page

from ....base.base_page import BasePage

class CohortBuilderPageLocators:
    BUTTON_IDENT = lambda button_name: f'[data-testid="button-cohort-builder-{button_name}"]'
    FACET_GROUP_IDENT = lambda group_name: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]'
    FACET_GROUP_SELECTION_IDENT = lambda group_name, selection: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]/..//input[@data-testid="checkbox-{selection}"]'



class CohortBuilderPage(BasePage):

    def __init__(self, driver: Page, url) -> None:
        super().__init__(driver)
        self.driver = driver
        self.URL = "{}/analysis_page?app=CohortBuilder".format(url)

    def navigate(self):
        self.goto(self.URL)

    def click_button(self, button_name:str) -> None:
        locator = CohortBuilderPageLocators.BUTTON_IDENT(self.normalize_button_identifier(button_name))
        self.click(locator)

    # Clicks a checkbox within a facet group
    def make_selection_within_facet_group(self, facet_group_name, selection):
        locator = CohortBuilderPageLocators.FACET_GROUP_SELECTION_IDENT(facet_group_name, selection)
        self.click(locator)

    # Checks to see if specified facet card is present
    def check_facet_card_presence(self, facet_group_name):
        locator = CohortBuilderPageLocators.FACET_GROUP_IDENT(facet_group_name)
        result = self.is_visible(locator)
        return result
