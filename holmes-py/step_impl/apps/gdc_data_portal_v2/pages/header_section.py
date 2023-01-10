from playwright.sync_api import Page

from ....base.base_page import BasePage

class HeaderSectionLocators:
    BUTTON_IDENT = lambda button_name: f"[data-testid='button-header-{button_name}']"

class HeaderSection(BasePage):

    def __init__(self, driver: Page, url):
        self.driver = driver  # driver is PW page


    def click_button(self, button_name:str):
        button_name = self.normalize_button_identifier(button_name)
        locator = HeaderSectionLocators.BUTTON_IDENT(button_name)
        self.click(self.normalize_button_identifier(locator))