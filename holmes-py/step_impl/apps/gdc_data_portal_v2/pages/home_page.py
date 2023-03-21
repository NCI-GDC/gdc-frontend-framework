from playwright.sync_api import Page

from ....base.base_page import BasePage


class HomePageLocators:
    """A class for Home page locators. All home page locators should come here"""

    NAV_NIH_LOGO = "img[data-testid='NIH_LOGO']"
    NAV_BAR_ANALYSIS_ICON = "img[alt='Analysis logo']"
    NAV_BAR_PROJECT_ICON = "img[alt='Studies logo']"
    NAV_BAR_COHORT_ICON = "img[alt='Cohort logo']"
    NAV_BAR_REPOSITORY_ICON = "img[alt='Downloads logo']"

    BUTTON_IDENT = lambda button_name: f"[data-testid='button-home-page-{button_name}']"

    BUTTON_BY_TEXT_IDENT = lambda text: f'a:has-text("{text}")'

    LIVE_STAT_BY_CATEGORY_IDENT = lambda expected_statistic: f'div[class="grid grid-cols-6 divide-x py-3 mt-2 bg-base-max rounded-md border-1 border-summarybar-border shadow-lg justify-between"] >> text="{expected_statistic}"'

class HomePage(BasePage):
    def __init__(self, driver: Page, url):
        self.URL = "{}/".format(url)
        self.driver = driver  # driver is PW page

    """Home page actions """

    def visit(self):
        self.driver.goto(self.URL)

    def navigate_to_app(self, app_name:str):
        app_name = self.normalize_button_identifier(app_name)
        self.driver.locator(HomePageLocators.BUTTON_IDENT(app_name)).click()

    def click_button_with_text(self, button_text:str):
        text_button_locator = HomePageLocators.BUTTON_BY_TEXT_IDENT(button_text)
        self.click(text_button_locator)

    def is_live_category_statistic_present(self, expected_statistic:str):
        expected_statistic_locator = HomePageLocators.LIVE_STAT_BY_CATEGORY_IDENT(expected_statistic)
        return self.is_visible(expected_statistic_locator)
