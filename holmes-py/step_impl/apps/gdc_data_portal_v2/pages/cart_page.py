from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

import time

class CartPageLocators:
    BUTTON_CART_PAGE = lambda data_testid: f'[data-testid="button-{data_testid}"]'
    BUTTON_REMOVE_FROM_CART = '[data-testid="button-remove-from-cart"]'

    BUTTON_BIOSPECIMEN_CART = '[data-testid="button-download-biospecimen"]'
    BUTTON_CLINICAL_CART = '[data-testid="button-download-clinical"]'
    BUTTON_DOWNLOAD_CART = '[data-testid="button-download-cart"]'

class CartPage(BasePage):
    def __init__(self, driver: Page, url):
        self.URL = "{}".format(url)
        self.driver = driver  # driver is PW page

    def click_button_cart_page(self, button_id):
        button_id = self.normalize_button_identifier(button_id)
        button_locator = CartPageLocators.BUTTON_CART_PAGE(button_id)
        self.click(button_locator)

    # These 3 functions are not DRY focused, but that trade off means they can be
    # retired in our download handling function. They were among the most flaky
    # tests in holmes-py, and now they pass every time.
    def click_biospecimen_dropdown_option(self, dropdown_option):
        # If the option text is not already present, click the dropdown menu button
        dropdown_button_locator = CartPageLocators.BUTTON_BIOSPECIMEN_CART
        is_locator_expanded = self.is_locator_expanded(dropdown_button_locator)
        if is_locator_expanded == 'false':
            self.click(dropdown_button_locator)
            time.sleep(0.2)
        self.click_text_option_from_dropdown_menu(dropdown_option)

    def click_clinical_dropdown_option(self, dropdown_option):
        # If the option text is not already present, click the dropdown menu button
        dropdown_button_locator = CartPageLocators.BUTTON_CLINICAL_CART
        is_locator_expanded = self.is_locator_expanded(dropdown_button_locator)
        if is_locator_expanded == 'false':
            self.click(dropdown_button_locator)
            time.sleep(0.2)
        self.click_text_option_from_dropdown_menu(dropdown_option)

    def click_download_cart_dropdown_option(self, dropdown_option):
        # If the option text is not already present, click the dropdown menu button
        dropdown_button_locator = CartPageLocators.BUTTON_DOWNLOAD_CART
        is_locator_expanded = self.is_locator_expanded(dropdown_button_locator)
        if is_locator_expanded == 'false':
            self.click(dropdown_button_locator)
            time.sleep(0.2)
        self.click_text_option_from_dropdown_menu(dropdown_option)

    def remove_all_files_from_cart(self, all_files_or_authorized_files):
        remove_from_cart_locator = CartPageLocators.BUTTON_REMOVE_FROM_CART
        if self.is_visible(remove_from_cart_locator):
            self.click(remove_from_cart_locator)
            self.click_has_text_option_from_dropdown_menu(all_files_or_authorized_files)
