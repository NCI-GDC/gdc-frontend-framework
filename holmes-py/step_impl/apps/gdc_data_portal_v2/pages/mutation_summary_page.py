from playwright.sync_api import Page

from ....base.base_page import BasePage


class MutationSummaryLocators:
    BUTTON_CONSEQUENCES = (
        lambda button_name: f"[data-testid='table-consequences-mutation-summary'] >> button:has-text('{button_name}') >> nth=0"
    )
    BUTTON_CANCER_DISTRIBUTION = (
        lambda button_name: f"[data-testid='table-cancer-distribution-mutation-summary'] >> button:has-text('{button_name}') >> nth=0"
    )


class MutationSummaryPage(BasePage):
    def __init__(self, driver: Page, url):
        self.driver = driver  # driver is PW page

    def click_consequences_button(self, button_name):
        locator = MutationSummaryLocators.BUTTON_CONSEQUENCES(button_name)
        self.click(locator)

    def click_cancer_distribution_button(self, button_name):
        locator = MutationSummaryLocators.BUTTON_CANCER_DISTRIBUTION(button_name)
        self.click(locator)
