import time

from playwright.sync_api import Page

from ....base.base_page import BasePage
from step_impl.apps.gdc_data_portal_v2.pages.header_section import HeaderSectionLocators

class AnalysisCenterLocators:
    BUTTON_APP_PLAY_OR_DEMO = lambda app_name: f'[data-testid="button-{app_name}"]'

    SELECT_DESCRIPTION_TOOL = lambda tool_name: f'[data-testid="{tool_name}-tool"] >> [data-testid="select-description-tool"]'
    TEXT_DESCRIPTION_TOOL = lambda tool_name: f'[data-testid="{tool_name}-tool"] >> [data-testid="text-description-tool"]'
    TOOLTIP_ZERO_CASES_ON_TOOL_CARD = lambda tool_name: f'[data-testid="{tool_name}-tool"] [data-testid="text-case-count-tool"] svg'

    FEATURED_TOOL_PROJECTS = 'button[aria-label="Navigate to Projects"]'
    FEATURED_TOOL_COHORT_BUILDER = 'button[aria-label="Navigate to Cohort Builder"]'
    FEATURED_TOOL_REPOSITORY = 'button[aria-label="Navigate to Repository"]'

    ANALYSIS_CENTER_HEADER = 'a[data-testid="button-header-analysis"]'

class AnalysisCenterPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def navigate_to_app(self, app_name: str):
        locator = AnalysisCenterLocators.BUTTON_APP_PLAY_OR_DEMO(app_name)
        self.click(locator)

    def click_analysis_tool_description(self, tool_name):
        """Clicks the description for an analysis tool"""
        locator = AnalysisCenterLocators.SELECT_DESCRIPTION_TOOL(tool_name)
        self.click(locator)

    def get_analysis_tool_text(self, tool_name):
        """After an analysis tool description is made visible, this returns the description"""
        locator = AnalysisCenterLocators.TEXT_DESCRIPTION_TOOL(tool_name)
        return self.get_text(locator)

    def get_analysis_tool_tooltip_text(self, tool_name, tooltip_text):
        """
        When an analysis tool has 0 cases, a tooltip appears on the tool card.
        This hovers over the tooltip and checks if the text matches our spec file
        """
        locator = AnalysisCenterLocators.TOOLTIP_ZERO_CASES_ON_TOOL_CARD(tool_name)
        # The click and sleep is to make the previous tooltip disappear, so it does not
        # affect the next tooltip check
        self.click(locator)
        time.sleep(0.5)
        self.hover(locator)
        is_tooltip_text_present = self.is_text_present(tooltip_text)
        return is_tooltip_text_present

    def featured_tools_navigation_check(self):
        # First element in the set: a featured tool navigate button
        # Second element in the set: an element to check if user landed on correct page
        nav_and_location = [
            (
                AnalysisCenterLocators.FEATURED_TOOL_PROJECTS,
                HeaderSectionLocators.PROJECTS_WAIT_FOR_ELEMENT,
            ),
            (
                AnalysisCenterLocators.FEATURED_TOOL_COHORT_BUILDER,
                HeaderSectionLocators.COHORT_BUILDER_WAIT_FOR_ELEMENT,
            ),
            (
                AnalysisCenterLocators.FEATURED_TOOL_REPOSITORY,
                HeaderSectionLocators.REPOSITORY_WAIT_FOR_ELEMENT,
            ),
        ]
        # Click on a featured tool nav button, then validate user arrived on correct page
        for navigation, location in nav_and_location:
            try:
                self.click(navigation)
                self.wait_until_locator_is_visible(location)
                # Navigate back to the analysis center for the next test
                self.click(AnalysisCenterLocators.ANALYSIS_CENTER_HEADER)
                self.wait_until_locator_is_visible(HeaderSectionLocators.ANALYSIS_CENTER_WAIT_FOR_ELEMENT)
            except:
                return False
        return True
