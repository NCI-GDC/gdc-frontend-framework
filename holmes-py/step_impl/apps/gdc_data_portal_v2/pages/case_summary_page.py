import time

from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators


class CaseSummaryLocators:
    # Ideally, after PEAR-1085 is developed, these can be replaced with unique IDs
    ADD_TO_CART_BUTTON_IDENT = 'text="Add all files to the cart"'
    REMOVE_FROM_CART_BUTTON_IDENT = 'text="Remove all files from the cart"'

    ADDED_TO_CART_MESSAGE_IDENT = 'p:has-text("Added")'
    REMOVED_FROM_CART_MESSAGE_IDENT = 'p:has-text("Removed")'

    SEARCH_BAR_FILES_TABLE = '[data-testid="table-files-case-summary"] >> [data-testid="textbox-table-search-bar"]'
    BUTTON_DOWNLOAD_FILE_FILES_TABLE = '[data-testid="table-files-case-summary"] >> [data-testid="button-download-file"]'

class CaseSummaryPage(BasePage):
    def __init__(self, driver: Page, url):
        self.driver = driver  # driver is PW page

    # Clicks 'Add all files to the cart' button and waits for confirmation message to appear
    def add_file_to_cart(self):
        add_file_button_locator = CaseSummaryLocators.ADD_TO_CART_BUTTON_IDENT
        self.click(add_file_button_locator)
        added_file_message = CaseSummaryLocators.ADDED_TO_CART_MESSAGE_IDENT
        self.wait_until_locator_is_visible(added_file_message)

    # Clicks 'Remove all files from the cart' button and waits for confirmation message to appear
    def remove_file_from_cart(self):
        remove_file_button_locator = CaseSummaryLocators.REMOVE_FROM_CART_BUTTON_IDENT
        self.click(remove_file_button_locator)
        removed_file_message = CaseSummaryLocators.REMOVED_FROM_CART_MESSAGE_IDENT
        self.wait_until_locator_is_visible(removed_file_message)

    def search_in_files_table(self, text_to_send):
        """Sends text into files table search bar"""
        locator = CaseSummaryLocators.SEARCH_BAR_FILES_TABLE
        self.wait_until_locator_is_visible(locator)
        self.send_keys(locator, text_to_send)
        time.sleep(1)
        self.wait_for_loading_spinner_table_to_detatch()

    def click_files_table_download_file_button(self):
        """Clicks download file in files table"""
        locator = CaseSummaryLocators.BUTTON_DOWNLOAD_FILE_FILES_TABLE
        self.click(locator)
