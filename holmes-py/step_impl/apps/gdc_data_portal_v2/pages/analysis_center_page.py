from playwright.sync_api import Page

from ....base.base_page import BasePage
from step_impl.apps.gdc_data_portal_v2.pages.header_section import HeaderSectionLocators

class AnalysisCenterLocators:
    FEATURED_TOOL_PROJECTS = 'button[aria-label="Navigate to Projects"]'
    FEATURED_TOOL_COHORT_BUILDER = 'button[aria-label="Navigate to Cohort Builder"]'
    FEATURED_TOOL_REPOSITORY = 'button[aria-label="Navigate to Repository"]'

    ANALYSIS_CENTER_HEADER = 'a[data-testid="button-header-analysis"]'

class AnalysisCenterPage(BasePage):

    def __init__(self, driver: Page, url):
        self.driver = driver  # driver is PW page

    def featured_tools_navigation_check(self):
        # First element in the set: a featured tool navigate button
        # Second element in the set: an element to check if user landed on correct page
        nav_and_location = [
            (
                AnalysisCenterLocators.FEATURED_TOOL_PROJECTS,
                HeaderSectionLocators.PROJECTS_WAIT_FOR_LOCATOR,
            ),
            (
                AnalysisCenterLocators.FEATURED_TOOL_COHORT_BUILDER,
                HeaderSectionLocators.COHORT_BUILDER_WAIT_FOR_LOCATOR,
            ),
            (
                AnalysisCenterLocators.FEATURED_TOOL_REPOSITORY,
                HeaderSectionLocators.REPOSITORY_WAIT_FOR_LOCATOR,
            ),
        ]
        # Click on a featured tool nav button, then validate user arrived on correct page
        for navigation, location in nav_and_location:
            try:
                self.click(navigation)
                self.wait_until_locator_is_visible(location)
                # Navigate back to the analysis center for the next test
                self.click(AnalysisCenterLocators.ANALYSIS_CENTER_HEADER)
                self.wait_until_locator_is_visible(HeaderSectionLocators.ANALYSIS_CENTER_WAIT_FOR_LOCATOR)
            except:
                return False
        return True
