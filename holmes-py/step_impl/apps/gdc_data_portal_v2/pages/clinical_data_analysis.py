from playwright.sync_api import Page
import time

from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePage
from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePageLocators



class ClinicalDataAnalysisLocators:
    CLINICAL_DATA_ANALYSIS_PLAY_BUTTON = "button[aria-label='Navigate to Clinical Data Analysis tool']"
    PLEASE_WAIT_SPINNER = "svg[data-testid='please_wait_spinner']"
    DEMOGRAPHIC_HEADER = "div[id=cdave-control-group-Demographic]"

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
        self.driver.wait_for_selector(ClinicalDataAnalysisLocators.DEMOGRAPHIC_HEADER, state="visible")

    def expand_clinical_property_sections(self):
        self.driver.locator(ClinicalDataAnalysisLocators.DEMOGRAPHIC_PLUS_BUTTON).click()
        self.driver.locator(ClinicalDataAnalysisLocators.DIAGNOSIS_PLUS_BUTTON).click()
        self.driver.locator(ClinicalDataAnalysisLocators.TREATMENT_PLUS_BUTTON).click()
        self.driver.locator(ClinicalDataAnalysisLocators.EXPOSURES_PLUS_BUTTON).click()
        print("done")
        time.sleep(5)

