from telnetlib import DO
from playwright.sync_api import Page
import time


class HomePageLocators:
    """A class for Home page locators. All home page locators should come here"""

    NAV_TOOL_BAR = lambda data_link: f"a[data-test='{data_link}']"
    ANALYSIS_CENTER_ICON_NAV = "img[alt='Analysis logo']"

class HomePage:
    def __init__(self, driver: Page, url):
        self.URL = "{}/".format(url)
        self.driver = driver  # driver is PW page

    """Home page actions """

    def visit(self):
        self.driver.goto(self.URL)

    def click_analysis_center_icon(self):
        self.driver.wait_for_selector(HomePageLocators.ANALYSIS_CENTER_ICON_NAV, state="visible")
        self.driver.locator(HomePageLocators.ANALYSIS_CENTER_ICON_NAV).click()
