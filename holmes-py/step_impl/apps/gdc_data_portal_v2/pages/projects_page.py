from playwright.sync_api import Page

from ....base.base_page import BasePage

class ProjectsPageLocators:
    FILTER_BUTTON_IDENT = lambda button_name: f"[data-testid='button-{button_name}']"


class ProjectsPage(BasePage):

    def __init__(self, driver: Page, url) -> None:
        super().__init__(driver)
        self.driver = driver
        self.URL = "{}/analysis_page?app=Projects".format(url)

    def navigate(self):
        self.goto(self.URL)

    def click_button(self, button_name: str):
        """Clicks file filter button and file filter options"""
        self.click(
            ProjectsPageLocators.FILTER_BUTTON_IDENT(
                self.normalize_button_identifier(button_name)
            )
        )
