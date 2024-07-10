from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators


class SetOperationsLocators:
    CHECKBOX_SELECT_SET = lambda set_name: f'[data-testid="checkbox-{set_name}-set-operations"]'
    TEXT_ITEM_COUNT= lambda set_name: f'[data-testid="text-{set_name}-item-count-set-operations"]'
    BUTTON_RUN_SELECTION_SCREEN = '[data-testid="button-run-set-operations"]'

    BUTTON_SAVE_NEW_SET = lambda set_name: f'tr:has([data-testid="checkbox-{set_name}-set-operations" ]) >> [data-testid="button-save-filtered-set"]'
    BUTTON_DOWNLOAD_TSV = lambda set_name: f'tr:has([data-testid="checkbox-{set_name}-set-operations" ]) >> [data-testid="button-download-tsv-set-operations"]'

    BUTTON_UNION_OF_SELECTED_SETS_SAVE_NEW_SET = '[data-testid="row-union-of-selected-sets"] >> [data-testid="button-save-filtered-set"]'
    BUTTON_UNION_OF_SELECTED_SETS_DOWNLOAD_TSV = '[data-testid="row-union-of-selected-sets"] >> [data-testid="button-download-tsv-set-operations"]'


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

    def click_run_set_operations_selection_screen(self):
        button_run_locator = (SetOperationsLocators.BUTTON_RUN_SELECTION_SCREEN)
        self.click(button_run_locator)

    def click_checkbox_set_operations(self, set_name):
        locator = SetOperationsLocators.CHECKBOX_SELECT_SET(set_name)
        return self.click(locator)

    def click_save_set_button_set_operations(self, set_name):
        set_name = self.normalize_identifier_underscore_keep_capitalization(set_name)
        locator = SetOperationsLocators.BUTTON_SAVE_NEW_SET(set_name)
        return self.click(locator)

    def click_union_row_save_set_button_set_operations(self):
        locator = SetOperationsLocators.BUTTON_UNION_OF_SELECTED_SETS_SAVE_NEW_SET()
        return self.click(locator)

    def click_download_tsv_button_set_operations(self, set_name):
        set_name = self.normalize_identifier_underscore_keep_capitalization(set_name)
        locator = SetOperationsLocators.BUTTON_DOWNLOAD_TSV(set_name)
        return self.click(locator)

    def click_union_row_download_tsv_button_set_operations(self):
        locator = SetOperationsLocators.BUTTON_UNION_OF_SELECTED_SETS_DOWNLOAD_TSV()
        return self.click(locator)
