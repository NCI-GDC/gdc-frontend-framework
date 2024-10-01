from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

import time

class ModalLocators:
    TEXT_IN_TEMPORARY_MODAL_MESSAGE = lambda expected_text: f'div[role="alert"]:has-text("{expected_text}")'
    ACCEPT_BUTTON = 'button[data-testid="button-intro-warning-accept"]'

    TAB_LIST = lambda tab_name: f'[data-testid="modal-tab-list"] >> text="{tab_name}"'
    TEXT_SET_COUNT = lambda set_name: f'[data-testid="text-{set_name}-set-count"]'

class Modal(BasePage):
    def __init__(self, driver: Page, url):
        self.URL = "{}".format(url)
        self.driver = driver  # driver is PW page

    def get_set_count(self, set_name):
        set_count = ModalLocators.TEXT_SET_COUNT(set_name)
        # If the text "..." is visible, that means the modal is still loading information. We wait until
        # it disappears or 10 seconds elapses before checking the card for actual text
        retry_counter = 0
        while self.get_text(set_count) == "...":
            time.sleep(1)
            retry_counter = retry_counter+1
            if retry_counter >= 10:
                break
        return self.get_text(set_count)

    def accept_warning(self):
        if self.is_visible(ModalLocators.ACCEPT_BUTTON):
            self.click(ModalLocators.ACCEPT_BUTTON)

    def click_tab_name(self, tab_name):
        tab_locator = ModalLocators.TAB_LIST(tab_name)
        self.click(tab_locator)

    def wait_for_text_in_temporary_message(self, text, action="remove modal"):
        """
        Waits for a piece of text to appear in the temporary cohort modal.
        That modal appears after an action has been performed on a cohort
        state (e.g create, save, delete, etc).
        """
        text_locator = ModalLocators.TEXT_IN_TEMPORARY_MODAL_MESSAGE(text)
        try:
            self.wait_until_locator_is_visible(text_locator)
            if action.lower() == "remove modal":
                # On occasion, the automation will move so fast and click the close 'x' button
                # it changes what the active cohort is. I cannot reproduce it manually, and it stops
                # when I put this sleep here.
                time.sleep(1)
                x_button_locator = GenericLocators.BUTTON_CLOSE_NOTIFICATION
                # Remove the message after locating it.
                # The messages can pile up, so removing them is sometimes necessary for subsequent scenarios
                self.click(x_button_locator)
        except:
            return False
        return True
