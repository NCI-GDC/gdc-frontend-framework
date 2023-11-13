from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

class ManageSetsLocators:
    BUTTON_CREATE_SET = '[data-testid="button-create-set"]'
    BUTTON_SET_MENU_OPTIONS = lambda dropdown_option: f'[data-testid="dropdown-menu-options"] >> text={dropdown_option}'

class ManageSetsPage(BasePage):
    def __init__(self, driver: Page, url:str) -> None:
        self.URL = "{}/analysis_page".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def click_create_set_and_select_from_dropdown(self, dropdown_option):
        self.click(ManageSetsLocators.BUTTON_CREATE_SET)
        self.click(ManageSetsLocators.BUTTON_SET_MENU_OPTIONS(dropdown_option))

    def click_import_set_browse(self, button_text_name):
        """
        Click the 'browse' button to open the file explorer.
        """
        # It does not click the 'browse' button without force parameter set to 'True'
        self.click(GenericLocators.BUTTON_BY_DISPLAYED_TEXT(button_text_name), force = True)
