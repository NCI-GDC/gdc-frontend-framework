from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators


class FileSummaryLocators:
    # Ideally, after PEAR-1085 is developed, these can be replaced with unique IDs
    ADD_TO_CART_BUTTON_IDENT = 'text="Add to Cart" >> nth=0'
    REMOVE_FROM_CART_BUTTON_IDENT = 'text="Remove From Cart" >> nth=0'

    ADDED_TO_CART_MESSAGE_IDENT = 'p:has-text("Added")'
    REMOVED_FROM_CART_MESSAGE_IDENT = 'p:has-text("Removed")'

    DOWNLOAD_BUTTON_IDENT = 'text="Download" >> nth=0'
    BUTTON_DOWNLOAD_FILE_IDENT = '[data-testid="button-download-file-summary"]'

    BUTTON_DOWNLOAD_FILE_VERSIONS = '[data-testid="table-file-versions-file-summary"] >> button:has-text("Download")'
    BUTTON_DOWNLOAD_ANNOTATIONS_OPTION = lambda download_option: f'[data-testid="table-annotations-file-summary"] >> button:has-text("{download_option}")'


class FileSummaryPage(BasePage):
    def __init__(self, driver: Page, url):
        self.driver = driver  # driver is PW page

    # Clicks 'Add to Cart' button and waits for confirmation message to appear
    def add_file_to_cart(self):
        add_file_button_locator = FileSummaryLocators.ADD_TO_CART_BUTTON_IDENT
        self.click(add_file_button_locator)
        added_file_message = FileSummaryLocators.ADDED_TO_CART_MESSAGE_IDENT
        self.wait_until_locator_is_visible(added_file_message)

    # Clicks 'Remove From Cart' button and waits for confirmation message to appear
    def remove_file_from_cart(self):
        remove_file_button_locator = FileSummaryLocators.REMOVE_FROM_CART_BUTTON_IDENT
        self.click(remove_file_button_locator)
        removed_file_message = FileSummaryLocators.REMOVED_FROM_CART_MESSAGE_IDENT
        self.wait_until_locator_is_visible(removed_file_message)

    def click_download_file_button(self):
        """Clicks download file button in upper-left corner"""
        self.click(FileSummaryLocators.BUTTON_DOWNLOAD_FILE_IDENT)

    def click_download_button(self):
        """Clicks first 'Download' button on the file summary page"""
        self.click(FileSummaryLocators.DOWNLOAD_BUTTON_IDENT)

    def click_file_version_download_option(self, download_option):
        """
        In file versions table, clicks download button.
        Then, selects option from dropdown menu.
        """
        file_version_download_button = FileSummaryLocators.BUTTON_DOWNLOAD_FILE_VERSIONS
        self.click(file_version_download_button)
        self.click_text_option_from_dropdown_menu(download_option)

    def click_annotation_table_download_option(self, download_option):
        """In annotations table, clicks specified download button."""
        annotation_table_download_button = FileSummaryLocators.BUTTON_DOWNLOAD_ANNOTATIONS_OPTION(download_option)
        self.click(annotation_table_download_button)
