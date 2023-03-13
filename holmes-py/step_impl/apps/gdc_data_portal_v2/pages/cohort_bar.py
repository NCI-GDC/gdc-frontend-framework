from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

class CohortBarLocators:
    COHORT_BAR_BUTTON = lambda button_name: f'[data-testid="{button_name}Button"]'

class CohortBar(BasePage):

    def __init__(self, driver: Page, url) -> None:
        super().__init__(driver)
        self.driver = driver
        self.URL = "{}/analysis_page?app=CohortBuilder".format(url)

    def navigate(self):
        self.goto(self.URL)

    def click_cohort_bar_button(self, button_name:str):
        locator = CohortBarLocators.COHORT_BAR_BUTTON(self.normalize_button_identifier(button_name))
        self.click(locator)
