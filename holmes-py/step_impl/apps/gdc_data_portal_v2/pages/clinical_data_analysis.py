from playwright.sync_api import Page

from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePage
from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePageLocators

class ClinicalDataAnalysisLocators:
    CLINICAL_DATA_ANALYSIS_PLAY_BUTTON = "button[aria-label='Navigate to Clinical Data Analysis tool']"
    PLEASE_WAIT_SPINNER = "svg[data-testid='please_wait_spinner']"

    GROUP_TABLE = lambda group: f"div[id=cdave-control-group-{group}]"
    GROUP_TABLE_PLUS_BUTTON = lambda group: f"div[id='cdave-control-group-{group}'] >> button[data-testid='plus-icon']"
    PROPERTY_ROW = lambda property: f"label:text('{property}')"


class ClinicalDataAnalysisPage:
    def __init__(self, driver: Page, url):
        self.URL = "{}/".format(url)
        self.driver = driver  # driver is PW page


    def visit(self):
        self.driver.goto(self.URL)

    def navigate_to_cdave_page(self):
        self.driver.locator(HomePageLocators.NAV_BAR_ANALYSIS_ICON).click()
        self.driver.locator(ClinicalDataAnalysisLocators.CLINICAL_DATA_ANALYSIS_PLAY_BUTTON).click()
        self.driver.wait_for_selector(ClinicalDataAnalysisLocators.PLEASE_WAIT_SPINNER, state="hidden")
        self.driver.wait_for_selector(ClinicalDataAnalysisLocators.GROUP_TABLE('Demographic'), state="visible")

    def expand_clinical_property_sections(self):
        self.driver.locator(ClinicalDataAnalysisLocators.GROUP_TABLE_PLUS_BUTTON('Demographic')).click()
        self.driver.locator(ClinicalDataAnalysisLocators.GROUP_TABLE_PLUS_BUTTON('Diagnosis')).click()
        self.driver.locator(ClinicalDataAnalysisLocators.GROUP_TABLE_PLUS_BUTTON('Treatment')).click()
        self.driver.locator(ClinicalDataAnalysisLocators.GROUP_TABLE_PLUS_BUTTON('Exposures')).click()

    def validate_property_table(self,table):
        # Grab the group value
        for row, value in enumerate(table):
            group = table[0][1]
            break

        # From the group value, select the correct table
        table_locator = ClinicalDataAnalysisLocators.GROUP_TABLE(group)

        # search for the property value in the specified table
        for row, value in enumerate(table):
            property = table[row][0]
            property_locator = table_locator + ">>" + ClinicalDataAnalysisLocators.PROPERTY_ROW(property)
            try:
                self.driver.wait_for_selector(property_locator, state="visible")
            except:
                # If there is a property value missing, the table is invalid and we return error information
                return f"The table '{group}' is missing the property '{property}'"
        # If we find all values in the table, it passes the test
        return True
