from playwright.sync_api import Page

from ....base.base_page import BasePage


class BrowseAnnotationsLocators:
    BUTTON_ANNOTATION_DOWNLOAD = lambda button_name: f"[data-testid='button-{button_name}-projects-table']"

class BrowseAnnotationPage(BasePage):
    def __init__(self, driver: Page, url):
        self.driver = driver  # driver is PW page

    def click_annotation_download_button(self, button_name):
        """Clicks either 'JSON' or 'TSV' download button"""
        button_name = self.normalize_button_identifier(button_name)
        locator = BrowseAnnotationsLocators.BUTTON_ANNOTATION_DOWNLOAD(button_name)
        self.click(locator)
