from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators
class CaseSummaryLocators:
    # Ideally, after PEAR-1085 is developed, these can be replaced with unique IDs
    ADD_TO_CART_BUTTON_IDENT = 'text="Add all files to the cart"'
    REMOVE_FROM_CART_BUTTON_IDENT = 'text="Remove all files from the cart"'

    ADDED_TO_CART_MESSAGE_IDENT = 'p:has-text("Added")'
    REMOVED_FROM_CART_MESSAGE_IDENT = 'p:has-text("Removed")'

    # The first download button in the table of the section "BIOSPECIMEN SUPPLEMENT FILE"
    BIOSPECIMEN_SUPPLEMENT_FILE_DOWNLOAD_FIRST_IDENT = 'h2:has-text("BIOSPECIMEN SUPPLEMENT FILE") >> ..  >> .. >> button:has-text("download") >> nth=0'

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

    # In 'Biospecimen Supplement File' area, clicks first 'Download' button in the table
    def click_biospecimen_supplement_file_first_download_button(self):
        self.click(CaseSummaryLocators.BIOSPECIMEN_SUPPLEMENT_FILE_DOWNLOAD_FIRST_IDENT)
