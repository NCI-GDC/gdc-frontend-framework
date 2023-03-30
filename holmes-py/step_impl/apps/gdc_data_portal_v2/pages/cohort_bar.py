from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

class CohortBarLocators:
    COHORT_BAR_BUTTON = lambda button_name: f'[data-testid="{button_name}Button"]'

    IMPORT_COHORT_MODAL = 'div:text("Import a New Cohort") >> ..  >> .. '
    SECOND_SAVE_MODAL = 'div:text("Save Cohort") >> ..  >> .. >> div:text("You cannot undo this action.")'

    SET_AS_COHORT_BUTTON_TEMP_COHORT_MESSAGE = 'span:has-text("Set this as your current cohort.")'

    X_BUTTON_IN_TEMP_COHORT_MESSAGE = '>> .. >> .. >> .. >> button[type="button"]'

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

    # Clicks "Set this as your current cohort." in the temp message
    def click_set_as_current_cohort_from_temp_message(self):
        locator = CohortBarLocators.SET_AS_COHORT_BUTTON_TEMP_COHORT_MESSAGE
        self.click(locator)

    # Checks if cohort bar button is disabled
    def is_cohort_bar_button_disabled(self, button_name:str):
        locator = CohortBarLocators.COHORT_BAR_BUTTON(self.normalize_button_identifier(button_name))
        class_attribute_text = self.get_attribute(locator, "class")
        # Cohort bar buttons are not disabled in the usual way of having the atribute "disabled".
        # Because of that, we cannot use the method 'is_disabled' on the locator.
        # So we read the locators class, and if it has "cursor-not-allowed" it indicates its disabled.
        return "cursor-not-allowed" in class_attribute_text

    # Waits for a piece of text to appear in the temporary cohort modal
    # That modal appears after an action has been performed on a cohort
    # state (e.g create, save, delete, etc. )
    def wait_for_text_in_cohort_message(self, text):
        text_locator = GenericLocators.TEXT_IN_PARAGRAPH(text)
        try:
            self.wait_until_locator_is_visible(text_locator)
            # Remove the message after locating it.
            # Automation moves fast, and the messages can pile up. That can cause problems for subsequent scenarios
            x_button_locator = text_locator + CohortBarLocators.X_BUTTON_IN_TEMP_COHORT_MESSAGE
            self.click(x_button_locator)
        except:
            return False
        return True

    def is_secondary_cohort_bar_save_screen_present(self):
        locator = CohortBarLocators.SECOND_SAVE_MODAL
        try:
            self.wait_until_locator_is_visible(locator)
        except:
            return False
        return True
