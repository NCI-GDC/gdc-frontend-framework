from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators


class SetOperationsLocators:
    CHECKBOX_SELECT_SET = lambda set_name: f'[data-testid="checkbox-{set_name}-set-operations"]'
    TEXT_ITEM_COUNT= lambda set_name: f'[data-testid="text-{set_name}-item-count-set-operations"]'

class SetOperationsPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=SetOperations".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def is_checkbox_disabled_set_operations(self, set_name):
        locator = SetOperationsLocators.CHECKBOX_SELECT_SET(set_name)
        return self.is_disabled(locator)

    def is_checkbox_enabled_set_operations(self, set_name):
        locator = SetOperationsLocators.CHECKBOX_SELECT_SET(set_name)
        return self.is_enabled(locator)

    def get_item_count_selection_screen_set_operations(self, set_name):
        locator = SetOperationsLocators.TEXT_ITEM_COUNT(set_name)
        return self.get_text(locator)

    def click_checkbox_set_operations(self, set_name):
        locator = SetOperationsLocators.CHECKBOX_SELECT_SET(set_name)
        return self.click(locator)
