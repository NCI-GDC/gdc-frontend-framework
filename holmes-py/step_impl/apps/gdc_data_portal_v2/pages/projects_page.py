from playwright.sync_api import Page

from ....base.base_page import BasePage


class ProjectsPageLocators:
    PROJECT_PAGE_BUTTON_IDENT = (
        lambda button_name: f"[data-testid='button-{button_name}']"
    )
    PROJECT_PAGE_SHORTED_NAME_BUTTON_IDENT = (
        lambda button_name: f"[data-testid='button-{button_name}-projects-table']"
    )
    BUTTON_SELECT_PROJECT_ROW = lambda button_name: f'[aria-label="Select the {button_name} project row"]'

class ProjectsPage(BasePage):
    def __init__(self, driver: Page, url) -> None:
        super().__init__(driver)
        self.driver = driver
        self.URL = "{}/analysis_page?app=Projects".format(url)

    def navigate(self):
        self.goto(self.URL)

    def click_button(self, button_name: str):
        """Clicks button on project page"""
        self.click(
            ProjectsPageLocators.PROJECT_PAGE_BUTTON_IDENT(
                self.normalize_button_identifier(button_name)
            )
        )

    def click_shortened_name_button(self, button_name: str):
        """Clicks button on project page using shorted input"""
        self.click(
            ProjectsPageLocators.PROJECT_PAGE_SHORTED_NAME_BUTTON_IDENT(
                self.normalize_button_identifier(button_name)
            )
        )

    def click_button_select_project_row(self, button_name: str):
        """Clicks button to select project row"""
        locator = ProjectsPageLocators.BUTTON_SELECT_PROJECT_ROW(button_name)
        self.click(locator)
