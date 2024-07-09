from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators


class SetOperationsLocators:
    CHECKBOX_SELECT_SET = lambda checkbox_name: f'[data-testid="checkbox-{checkbox_name}-set-operations"]'



class SetOperationsPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=SetOperations".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def is_checkbox_disabled_set_operations(self, checkbox_name):
        locator = SetOperationsLocators.CHECKBOX_SELECT_SET(checkbox_name)
        return self.is_disabled(locator)

    def is_checkbox_enabled_set_operations(self, checkbox_name):
        locator = SetOperationsLocators.CHECKBOX_SELECT_SET(checkbox_name)
        return self.is_enabled(locator)

    def click_checkbox_set_operations(self, checkbox_name):
        locator = SetOperationsLocators.CHECKBOX_SELECT_SET(checkbox_name)
        return self.click(locator)
