from telnetlib import DO
from playwright.sync_api import Page
from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePage
from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePageLocators
import time


class NavAnalysisCenterLocators:
    """A class for Home page locators. All home page locators should come here"""

    TOOL_MANAGEMENT_SECTION = "div[data-tour='analysis_tool_management']"
    COHORT_BUILDER_SECTION = "text='Cohort Builder' >> nth = 1"
    REPOSITORY_VIEW_IMAGE_BUTTON = "text='View Images'"

class NavAnalysisCenterPage:
    def __init__(self, driver: Page, url):
        self.URL = "{}/".format(url)
        self.driver = driver  # driver is PW page

    """Home page actions """

    def visit(self):
        self.driver.goto(self.URL)

    def navigation_bar_card_check(self):
        nav_and_location = [(HomePageLocators.NAV_BAR_ANALYSIS_ICON,NavAnalysisCenterLocators.TOOL_MANAGEMENT_SECTION),
        (HomePageLocators.NAV_BAR_COHORT_ICON,NavAnalysisCenterLocators.COHORT_BUILDER_SECTION),
        (HomePageLocators.NAV_BAR_REPOSITORY_ICON,NavAnalysisCenterLocators.REPOSITORY_VIEW_IMAGE_BUTTON)]
        # Click on an icon from the nav bar, then validate user arrived on correct page
        for navigation, location in (nav_and_location):
            try:
                self.driver.locator(navigation).click()                
                self.driver.wait_for_selector(location, state="visible")
            except:
                return False
        return True

    def navigation_default_view_card_check(self): 
        navigation_icon = [(HomePageLocators.NAV_DEFAULT_COHORT_ICON,HomePageLocators.NAV_BAR_ANALYSIS_ICON),
        (HomePageLocators.NAV_DEFAULT_ANALYSIS_ICON,HomePageLocators.NAV_BAR_COHORT_ICON),
        (HomePageLocators.NAV_DEFAULT_COHORT_ICON,HomePageLocators.NAV_BAR_REPOSITORY_ICON),
        (HomePageLocators.NAV_DEFAULT_REPOSITORY_ICON,HomePageLocators.NAV_BAR_COHORT_ICON),
        (HomePageLocators.NAV_DEFAULT_ANALYSIS_ICON,HomePageLocators.NAV_BAR_REPOSITORY_ICON),
        (HomePageLocators.NAV_DEFAULT_REPOSITORY_ICON,HomePageLocators.NAV_BAR_ANALYSIS_ICON)]

        check_for_location = [(NavAnalysisCenterLocators.COHORT_BUILDER_SECTION,NavAnalysisCenterLocators.TOOL_MANAGEMENT_SECTION),
        (NavAnalysisCenterLocators.TOOL_MANAGEMENT_SECTION,NavAnalysisCenterLocators.COHORT_BUILDER_SECTION),
        (NavAnalysisCenterLocators.COHORT_BUILDER_SECTION,NavAnalysisCenterLocators.REPOSITORY_VIEW_IMAGE_BUTTON),
        (NavAnalysisCenterLocators.REPOSITORY_VIEW_IMAGE_BUTTON,NavAnalysisCenterLocators.COHORT_BUILDER_SECTION),
        (NavAnalysisCenterLocators.TOOL_MANAGEMENT_SECTION,NavAnalysisCenterLocators.REPOSITORY_VIEW_IMAGE_BUTTON),
        (NavAnalysisCenterLocators.REPOSITORY_VIEW_IMAGE_BUTTON,NavAnalysisCenterLocators.TOOL_MANAGEMENT_SECTION)]
        # Start at the home screen. Click an icon from the default (center) of the screen. Validate user arrived at correct screen.
        # Then, click on the nav bar to another location. Validate user arrived at correct screen. Done for all permutations of default
        # navigation. 
        for navigation, location in zip(navigation_icon,check_for_location):
            HomePage.visit(self)
            try:
                 self.driver.locator(navigation[0]).click()
                 self.driver.wait_for_selector(location[0], state="visible")   
                 self.driver.locator(navigation[1]).click()
                 self.driver.wait_for_selector(location[1], state="visible")     
            except:
                return False
        return True              

