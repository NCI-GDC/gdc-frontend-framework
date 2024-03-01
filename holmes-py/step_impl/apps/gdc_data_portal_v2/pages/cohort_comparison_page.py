from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

class CohortComparisonLocators:
    TEXT_COHORT_CASE_COUNT_SELECTION_SCREEN = lambda cohort_name: f'[data-testid="text-{cohort_name}-case-count-cohort-comparison"]'
    BUTTON_SELECT_COHORT_TO_COMPARE_COHORT  = lambda cohort_name: f'[data-testid="button-{cohort_name}-cohort-comparison"]'

class CohortComparisonPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def select_cohort_to_compare_with(self, cohort_name:str):
        """
        Clicks a button to select a cohort to compare with on the cohort comparison selection screen.
        """
        button_select_cohort_to_compare_locator = CohortComparisonLocators.BUTTON_SELECT_COHORT_TO_COMPARE_COHORT(cohort_name)
        self.click(button_select_cohort_to_compare_locator)

    def get_cohort_case_count_on_selection_screen(self, cohort_name: str):
        """
        Returns the case count of the specified cohort on the cohort comparison selection screen.
        """
        cohort_case_count_selection_screen_locator = CohortComparisonLocators.TEXT_COHORT_CASE_COUNT_SELECTION_SCREEN(cohort_name)
        return self.get_text(cohort_case_count_selection_screen_locator)
