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

    # Clicks first 'Download' button on the file summary apge
    def click_download_button(self):
        self.click(FileSummaryLocators.DOWNLOAD_BUTTON_IDENT)
