from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

class CohortBarLocators:
    COHORT_BAR_BUTTON = lambda button_name: f'[data-testid="{button_name}Button"]'

    IMPORT_COHORT_MODAL = 'div:text("Import a New Cohort") >> ..  >> .. '
    BROWSE_BUTTON = lambda button_text_name: f'span:text("{button_text_name}")'

    TEXT_IN_TEMP_COHORT_MESSAGE = lambda text: f'b:has-text("{text}")'
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

    def click_import_cohort_browse(self, button_text_name:str):
        self.wait_until_locator_is_visible(CohortBarLocators.IMPORT_COHORT_MODAL)
        self.click(GenericLocators.BUTTON_BY_DISPLAYED_TEXT(button_text_name), force = True)

    def click_cohort_bar_named_button(self, button_text_name:str):
        self.click(GenericLocators.BUTTON_BY_DISPLAYED_TEXT(button_text_name))

    def wait_for_text_in_cohort_message(self, text):
        locator = CohortBarLocators.TEXT_IN_TEMP_COHORT_MESSAGE(text)
        try:
            self.wait_until_locator_is_visible(locator)
        except:
            return False
        return True
