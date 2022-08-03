from telnetlib import DO
from playwright.sync_api import Page
import time


class HomePageLocators:
    """A class for Home page locators. All home page locators should come here"""

    NAV_TOOL_BAR = lambda data_link: f"a[data-test='{data_link}']"
    CANCEL_BUTTON = "button[data-test='modal-cancel-button']"
    DOWNLOAD_BUTTON = "i[class=' fa fa-download']"
    DOWNLOAD_FILES_BUTTON = "button:near(button[data-test='modal-cancel-button'])"
    DOWNLOAD_CART_BUTTON = "span[class='dropdown activetest-cart-download-dropdown '] >> span:has-text('Cart')"
    DROPDOWN_DOWNLOAD_CART = "span[class='dropdowntest-cart-download-dropdown ']"
    HOME_SEARCH_FIELD = "input[data-test='home-search-input']"
    CONTROLLED_FILE_CHECKBOX = "input[id='input-Access-controlled']"
    CURRENT_FILTERS = "div[class='test-current-filters']"
    FIRST_FILE_IN_TABLE = "table[id='repository-files-table']>> tbody >> :nth-match(tr,1) >> button[data-test='untagged-button']"


class HomePage:
    def __init__(self, driver: Page, url):
        self.URL = "{}/".format(url)
        self.driver = driver  # driver is PW page

    """Home page actions """

    def visit(self):
        self.driver.goto(self.URL)

    def click_cancel_button_and_wait(self):
        self.driver.wait_for_selector(HomePageLocators.CANCEL_BUTTON, state="visible")
        self.driver.locator(HomePageLocators.CANCEL_BUTTON).click()
        self.driver.wait_for_selector(HomePageLocators.CANCEL_BUTTON, state="hidden")

    def search_and_click_on_front_page(self, UUID):
        self.driver.locator(HomePageLocators.HOME_SEARCH_FIELD).fill(UUID)
        self.driver.wait_for_selector("ul:has-text('" + UUID + "')", state="visible")
        self.driver.locator("ul:has-text('" + UUID + "')").click()
        self.driver.wait_for_selector(HomePageLocators.DOWNLOAD_BUTTON, state="visible")
        self.driver.locator(HomePageLocators.DOWNLOAD_BUTTON).click()
        time.sleep(2)
        self.driver.locator(HomePageLocators.NAV_TOOL_BAR("home-link")).click()
        self.driver.wait_for_selector(
            HomePageLocators.HOME_SEARCH_FIELD, state="visible"
        )

    def find_and_attempt_download_of_controlled_file(self):
        self.driver.locator(HomePageLocators.NAV_TOOL_BAR("repository-link")).click()
        self.driver.wait_for_selector(HomePageLocators.CURRENT_FILTERS, state="visible")
        self.driver.locator(HomePageLocators.CONTROLLED_FILE_CHECKBOX).click()
        self.driver.locator(HomePageLocators.FIRST_FILE_IN_TABLE).click()
        self.driver.locator(HomePageLocators.NAV_TOOL_BAR("cart-link")).click()
        self.driver.wait_for_selector(
            HomePageLocators.DROPDOWN_DOWNLOAD_CART, state="visible"
        )
        self.driver.locator(HomePageLocators.DROPDOWN_DOWNLOAD_CART).click()
        self.driver.locator(HomePageLocators.DOWNLOAD_CART_BUTTON).click()
        is_download_disabled = self.driver.locator(
            HomePageLocators.DOWNLOAD_FILES_BUTTON
        ).is_disabled()
        self.driver.locator(HomePageLocators.CANCEL_BUTTON).click()
        return is_download_disabled
