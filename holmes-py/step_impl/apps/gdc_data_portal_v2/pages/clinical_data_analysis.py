from ast import Try
from playwright.sync_api import Page

from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePage
from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePageLocators

class ClinicalDataAnalysisLocators:
    CLINICAL_DATA_ANALYSIS_PLAY_BUTTON = "button[aria-label='Navigate to Clinical Data Analysis tool']"
    PLEASE_WAIT_SPINNER = "svg[data-testid='please_wait_spinner']"

    DEMOGRAPHIC_TABLE = "div[id=cdave-control-group-Demographic]"
    DIAGNOSIS_TABLE = "div[id=cdave-control-group-Diagnosis]"
    TREATMENT_TABLE = "div[id=cdave-control-group-Treatment]"
    EXPOSURES_TABLE = "div[id=cdave-control-group-Exposures]"
    PROPERTY_ROW = lambda property: f"label:text('{property}')"

    DEMOGRAPHIC_PLUS_BUTTON = "div[id='cdave-control-group-Demographic'] >> button[data-testid='plus-icon']"
    DIAGNOSIS_PLUS_BUTTON = "div[id='cdave-control-group-Diagnosis'] >> button[data-testid='plus-icon']"
    TREATMENT_PLUS_BUTTON = "div[id='cdave-control-group-Treatment'] >> button[data-testid='plus-icon']"
    EXPOSURES_PLUS_BUTTON = "div[id='cdave-control-group-Exposures'] >> button[data-testid='plus-icon']"

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
        self.driver.wait_for_selector(ClinicalDataAnalysisLocators.DEMOGRAPHIC_TABLE, state="visible")

    def expand_clinical_property_sections(self):
        self.driver.locator(ClinicalDataAnalysisLocators.DEMOGRAPHIC_PLUS_BUTTON).click()
        self.driver.locator(ClinicalDataAnalysisLocators.DIAGNOSIS_PLUS_BUTTON).click()
        self.driver.locator(ClinicalDataAnalysisLocators.TREATMENT_PLUS_BUTTON).click()
        self.driver.locator(ClinicalDataAnalysisLocators.EXPOSURES_PLUS_BUTTON).click()

    def validate_property_table(self,table):
        # Grab the group value
        for row, value in enumerate(table):
            group = table[0][1]
            break

        # Group value determines what table we look into
        # There is a 'match' function, but only on python 3.10>
        if group == "Demographic":
            table_locator = ClinicalDataAnalysisLocators.DEMOGRAPHIC_TABLE
        elif group == "Diagnosis":
            table_locator = ClinicalDataAnalysisLocators.DIAGNOSIS_TABLE
        elif group == "Treatment":
            table_locator = ClinicalDataAnalysisLocators.TREATMENT_TABLE
        elif group == "Exposures":
            table_locator = ClinicalDataAnalysisLocators.EXPOSURES_TABLE

        # search for the property value in the specified table
        for row, value in enumerate(table):
            property = table[row][0]
            property_locator = table_locator + ">>" + ClinicalDataAnalysisLocators.PROPERTY_ROW(property)                
            try:
                self.driver.wait_for_selector(property_locator, state="visible")
            except:
                # If there is a property value missing, the table is invalid and we return error information
                return "The table '" + group + "' is missing the property '" + property + "'"
        # If we find all values in the table, it passes the test
        return True
