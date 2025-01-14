from playwright.sync_api import Page

from ....base.base_page import BasePage


class GeneSummaryLocators:
    BUTTON_CANCER_DISTRIBUTION = (
        lambda button_name: f"[data-testid='table-cancer-distribution-gene-summary'] >> button:has-text('{button_name}') >> nth=0"
    )

class GeneSummaryPage(BasePage):
    def __init__(self, driver: Page, url):
        self.driver = driver  # driver is PW page

    def click_cancer_distribution_button(self, button_name):
        locator = GeneSummaryLocators.BUTTON_CANCER_DISTRIBUTION(button_name)
        self.click(locator)
