from playwright.sync_api import Page

from ....base.base_page import BasePage


class MutationFrequencyLocators:
    TITLE = lambda title_name: f'div[data-testid="{title_name}-title"]'

class MutationFrequencyPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=MutationFrequencyApp".format(url)
        self.driver = driver  # driver is PW page
        super().__init__(self.driver)

    def visit(self):
        self.driver.goto(self.URL)
