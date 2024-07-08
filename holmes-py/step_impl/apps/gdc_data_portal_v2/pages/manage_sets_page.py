from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

import time


class ManageSetsLocators:
    BUTTON_CREATE_SET = '[data-testid="button-create-set"]'
    BUTTON_SET_MENU_OPTIONS = (
        lambda dropdown_option: f'[data-testid="dropdown-menu-options"] >> text={dropdown_option}'
    )

    BUTTON_IN_SET_ROW = (
        lambda button_to_select, set_name: f'[data-testid="table-manage-sets"] >> td:has-text("{set_name}") >> .. >> [data-testid="button-{button_to_select}"]'
    )
    BUTTON_DOWNLOAD_IN_SET_ROW = (
        lambda set_name: f'[data-testid="table-manage-sets"] >> td:has-text("{set_name}") >> .. >> [data-testid="button-download-set"]'
    )
    CHECKBOX_IN_SET_ROW = (
        lambda set_name: f'[data-testid="table-manage-sets"] >> td:has-text("{set_name}") >> .. >> [data-testid="checkbox-select-set"]'
    )
    ITEM_LIST_BUTTON_IN_SET_ROW = (
        lambda set_name: f'[data-testid="table-manage-sets"] >> td:has-text("{set_name}") >> .. >> [data-testid="text-set-count"]'
    )

    BUTTON_CLOSE_SET_PANEL = 'button[aria-label="Close set panel"]'


class ManageSetsPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def wait_for_set_text_in_temporary_message(self, text, action="remove modal"):
        """
        Waits for a piece of text to appear in a temporary message.
        The message appears after an action has has been performed on a set
        (e.g create, save, delete, etc).
        """
        text_locator = GenericLocators.TEXT_IDENT(text)
        try:
            self.wait_until_locator_is_visible(text_locator)
            if action.lower() == "remove modal":
                # On occasion, the automation will move so fast and click the close 'x' button
                # it changes what the active cohort is. I cannot reproduce it manually, and it stops
                # when I put this sleep here.
                time.sleep(1)
                # Remove the message after locating it.
                # The messages can pile up, so removing them is sometimes necessary for subsequent scenarios
                self.click(GenericLocators.BUTTON_CLOSE_NOTIFICATION)
        except:
            return False
        return True

    def click_create_set_and_select_from_dropdown(self, dropdown_option):
        "Clicks create set dropdown button, and then selects a set option from the dropdown"
        self.click(ManageSetsLocators.BUTTON_CREATE_SET)
        self.click(ManageSetsLocators.BUTTON_SET_MENU_OPTIONS(dropdown_option))

    def click_browse_import_set(self, button_text_name):
        """
        Click the 'browse' button to open the file explorer.
        """
        # It does not click the 'browse' button without force parameter set to 'True'
        self.click(
            GenericLocators.BUTTON_BY_DISPLAYED_TEXT(button_text_name), force=True
        )

    def click_button_on_set_row_in_manage_sets(self, button_to_select, set_name):
        "Identifies the row based on set name, then clicks specified button"
        button_to_select = self.normalize_button_identifier(button_to_select)
        self.click(ManageSetsLocators.BUTTON_IN_SET_ROW(button_to_select, set_name))

    def click_checkbox_on_set_row_in_manage_sets(self, set_name):
        "Identifies the row based on set name, then clicks the checkbox to select it"
        locator = ManageSetsLocators.CHECKBOX_IN_SET_ROW(set_name)
        self.click(locator)

    def click_item_list_on_set_row_in_manage_sets(self, set_name):
        "Identifies the row based on set name, then clicks the item/set list button"
        locator = ManageSetsLocators.ITEM_LIST_BUTTON_IN_SET_ROW(set_name)
        self.click(locator)

    def click_close_set_panel(self):
        "Closes the set panel (the panel that opens when user clicks on item/set list button"
        locator = ManageSetsLocators.BUTTON_CLOSE_SET_PANEL
        self.click(locator)

    def click_on_download_for_set(self, set_name):
        "Identifies the row based on set name, then clicks the download button"
        locator = ManageSetsLocators.BUTTON_DOWNLOAD_IN_SET_ROW(set_name)
        self.click(locator)
