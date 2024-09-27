from playwright.sync_api import Page

from ....base.base_page import BasePage


class ProjectSummaryLocators:
    BUTTON_PROJECT_SUMMARY_PAGE = (
        lambda button_name: f"[data-testid='button-{button_name}-project-summary']"
    )
    TEXT_PROJECT_SUMMARY_PAGE = (
        lambda text_identifier: f"[data-testid='text-{text_identifier}-project-summary']"
    )

    BUTTON_ANNOTATION_DOWNLOAD = (
        lambda button_name: f"[data-testid='table-annotations-project-summary'] >> [data-testid='button-{button_name}-projects-table']"
    )

class ProjectSummaryPage(BasePage):
    def __init__(self, driver: Page, url):
        self.driver = driver  # driver is PW page

    def click_button(self, button_name):
        """Clicks specified button on Project Summary page"""
        button_name = self.normalize_button_identifier(button_name)
        locator = ProjectSummaryLocators.BUTTON_PROJECT_SUMMARY_PAGE(button_name)
        self.click(locator)

    def click_annotation_download_button(self, button_name):
        """Clicks either 'JSON' or 'TSV' download button"""
        button_name = self.normalize_button_identifier(button_name)
        locator = ProjectSummaryLocators.BUTTON_ANNOTATION_DOWNLOAD(button_name)
        self.click(locator)

    def get_text_project_summary(self, text_identifier):
        """Returns specified text displayed on Project Summary page"""
        text_identifier = self.normalize_button_identifier(text_identifier)
        locator = ProjectSummaryLocators.TEXT_PROJECT_SUMMARY_PAGE(text_identifier)
        return self.get_text(locator)
