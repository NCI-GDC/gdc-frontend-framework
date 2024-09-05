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

    BUTTON_CASE_SUMMARY_PAGE = lambda button_name: f"[data-testid='button-{button_name}-case-summary']"

    BUTTON_CLINICAL_TAB = lambda tab_name: f"[data-testid='button-{tab_name}-tab']"
    BUTTON_CLINICAL_DOWNLOAD = "[data-testid='table-clinical-case-summary'] >> div:text-is('Download')"

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

    def click_button(self, button_name):
        """Clicks specified button on Case Summary page"""
        button_name = self.normalize_button_identifier(button_name)
        locator = CaseSummaryLocators.BUTTON_CASE_SUMMARY_PAGE(button_name)
        self.click(locator)

    def click_clinical_table_tab(self, tab_name):
        """Clicks specified tab on Clinical table"""
        tab_name = self.normalize_button_identifier(tab_name)
        locator = CaseSummaryLocators.BUTTON_CLINICAL_TAB(tab_name)
        self.click(locator)

    def click_clinical_table_download_button(self, download_type):
        """Clicks download TSV or JSON in Clinical table"""
        download_button = CaseSummaryLocators.BUTTON_CLINICAL_DOWNLOAD
        self.click(download_button)
        self.click_text_option_from_dropdown_menu(download_type)

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
