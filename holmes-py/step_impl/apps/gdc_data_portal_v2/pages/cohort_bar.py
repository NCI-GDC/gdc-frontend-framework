from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

class CohortBarLocators:
    COHORT_BAR_BUTTON = lambda button_name: f'[data-testid="{button_name}Button"]'

    IMPORT_COHORT_MODAL = 'div:text("Import a New Cohort") >> ..  >> .. '

    TEXT_IN_TEMP_COHORT_MESSAGE = lambda text: f'b:has-text("{text}")'
class CohortBar(BasePage):

    def __init__(self, driver: Page, url) -> None:
        super().__init__(driver)
        self.driver = driver
        self.URL = "{}/analysis_page?app=CohortBuilder".format(url)

    def navigate(self):
        self.goto(self.URL)

    # Clicks a button on the actual cohort bar
    def click_cohort_bar_button(self, button_name:str):
        locator = CohortBarLocators.COHORT_BAR_BUTTON(self.normalize_button_identifier(button_name))
        self.click(locator)

    # After import cohort button has been clicked, we make sure the correct modal has loaded.
    # Then, we click the 'browse' button to open the file explorer.
    def click_import_cohort_browse(self, button_text_name:str):
        self.wait_until_locator_is_visible(CohortBarLocators.IMPORT_COHORT_MODAL)
        # It does not click the 'browse' button without force parameter set to 'True'
        self.click(GenericLocators.BUTTON_BY_DISPLAYED_TEXT(button_text_name), force = True)

    # Waits for a piece of text to appear in the temporary cohort modal
    # That modal appears after an action has been performed on a cohort
    # state (e.g create, save, delete, etc. )
    def wait_for_text_in_cohort_message(self, text):
        locator = CohortBarLocators.TEXT_IN_TEMP_COHORT_MESSAGE(text)
        try:
            self.wait_until_locator_is_visible(locator)
        except:
            return False
        return True
