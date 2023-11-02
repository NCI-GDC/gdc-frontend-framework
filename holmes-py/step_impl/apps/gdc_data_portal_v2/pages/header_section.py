from playwright.sync_api import Page

from ....base.base_page import BasePage

class HeaderSectionLocators:
    BUTTON_IDENT = lambda button_name: f"[data-testid='button-header-{button_name}']"

    # These are all locators that only appear when the respective page has fully loaded
    ANALYSIS_CENTER_WAIT_FOR_ELEMENT = "button[aria-label='Navigate to Clinical Data Analysis tool']"
    PROJECTS_WAIT_FOR_ELEMENT = "input[data-testid='checkbox-biospecimen']"
    COHORT_BUILDER_WAIT_FOR_ELEMENT = "button[data-testid='button-cohort-builder-general']"
    REPOSITORY_WAIT_FOR_ELEMENT = "button[data-testid='button-json-files-table']"
    REPOSITORY_ADDITIONAL_WAIT_FOR_ELEMENT = "[data-testid='text-showing-count']"
    HOME_WAIT_FOR_ELEMENT = "[data-testid='homepage-live-statistics']"

class HeaderSection(BasePage):

    def __init__(self, driver: Page, url):
        self.driver = driver  # driver is PW page

    def navigate_to_main_pages(self, button_name:str):
        button_name = self.normalize_button_identifier(button_name)
        locator = HeaderSectionLocators.BUTTON_IDENT(button_name)
        self.wait_for_loading_spinner_to_detatch()
        self.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        self.wait_until_locator_is_visible(locator)
        self.click(locator, True)
        self.wait_for_page_to_load(button_name)

    # Pages in the data portal do not load instantaneously.
    # We want to wait for the main content of the page to load before continuing the test.
    def wait_for_page_to_load(self, page_to_load):
        page_to_load = page_to_load.lower()
        if page_to_load == "analysis":
            self.wait_for_selector(HeaderSectionLocators.ANALYSIS_CENTER_WAIT_FOR_ELEMENT)
        elif page_to_load == "projects":
            self.wait_for_selector(HeaderSectionLocators.PROJECTS_WAIT_FOR_ELEMENT)
        elif page_to_load == "cohort":
            self.wait_for_selector(HeaderSectionLocators.COHORT_BUILDER_WAIT_FOR_ELEMENT)
            self.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        elif page_to_load == "downloads":
            # Repository page does not load quickly, and automation will move too fast at times
            self.wait_for_selector(HeaderSectionLocators.REPOSITORY_WAIT_FOR_ELEMENT)
            self.wait_for_selector(HeaderSectionLocators.REPOSITORY_ADDITIONAL_WAIT_FOR_ELEMENT)
            self.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
            self.wait_for_loading_spinner_table_to_detatch()
        elif page_to_load == "home":
            self.wait_for_selector(HeaderSectionLocators.HOME_WAIT_FOR_ELEMENT)
