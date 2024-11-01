from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

import time

class CartPageLocators:
    BUTTON_CART_PAGE = lambda data_testid: f'[data-testid="button-{data_testid}"]'
    BUTTON_REMOVE_FROM_CART = '[data-testid="button-remove-from-cart"]'

class CartPage(BasePage):
    def __init__(self, driver: Page, url):
        self.URL = "{}".format(url)
        self.driver = driver  # driver is PW page

    def click_button_cart_page(self, button_id):
        button_id = self.normalize_button_identifier(button_id)
        button_locator = CartPageLocators.BUTTON_CART_PAGE(button_id)
        self.click(button_locator)

    def remove_all_files_from_cart(self, all_files_or_authorized_files):
        remove_from_cart_locator = CartPageLocators.BUTTON_REMOVE_FROM_CART
        if self.is_visible(remove_from_cart_locator):
            self.click(remove_from_cart_locator)
            self.click_has_text_option_from_dropdown_menu(all_files_or_authorized_files)
