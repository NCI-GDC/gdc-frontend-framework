from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

class CohortComparisonLocators:
    TEXT_COHORT_CASE_COUNT_SELECTION_SCREEN = lambda cohort_name: f'[data-testid="text-{cohort_name}-case-count-cohort-comparison"]'
    BUTTON_SELECT_COHORT_TO_COMPARE_COHORT  = lambda cohort_name: f'[data-testid="button-{cohort_name}-cohort-comparison"]'
    BUTTON_RUN_COHORT_COMPARISON_SELECTION_SCREEN = '[data-testid="button-run-cohort-comparison"]'

    LOADING_SPINNER_SURVIVAL_PLOT = '[data-testid="card-analysis-survival-cohort-comparison"] circle >> nth=0'

    TEXT_COHORT_CASE_COUNT_MAIN_SCREEN = lambda cohort_number: f'[data-testid="text-cohort-case-count-cohort-comparison"] >> nth={cohort_number}'

    BUTTON_ADD_REMOVE_ANALYSIS_CARD = lambda analysis_card_name: f'[data-testid="button-enable-{analysis_card_name}-cohort-comparison"]'
    ANALYSIS_CARD_IDENT = lambda analysis_card_name: f'[data-testid="card-{analysis_card_name}-cohort-comparison"]'
    BUTTON_SAVE_COHORT_ANALYSIS_CARD = (
        lambda analysis_card, row_name, cohort_number: f'[data-testid="card-{analysis_card}-cohort-comparison"] >> [data-testid="text-analysis-{row_name}"] >> .. >> [data-testid="button-save-filtered-cohort"] >>nth={cohort_number}'
    )

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

    def get_cohort_case_count_on_main_screen(self, cohort_number: str):
        """
        Returns the case count of the specified cohort (1st or 2nd cohort) on the cohort comparison main screen.
        """
        cohort_case_count_main_screen_locator = CohortComparisonLocators.TEXT_COHORT_CASE_COUNT_MAIN_SCREEN(cohort_number)
        return self.get_text(cohort_case_count_main_screen_locator)

    def click_run_comparison_cohort_comparison_selection_screen(self):
        button_run_comparison_locator = CohortComparisonLocators.BUTTON_RUN_COHORT_COMPARISON_SELECTION_SCREEN
        self.click(button_run_comparison_locator)

    def wait_for_survival_plot_loading_spinner_to_detatch_cohort_comparison(self):
        """Waits for the survival plot loading spinner to disappear on the page"""
        locator = CohortComparisonLocators.LOADING_SPINNER_SURVIVAL_PLOT
        self.wait_until_locator_is_detached(locator)

    def click_analysis_card_button_enable_disable(self, analysis_card_name:str):
        """
        Clicks a checkbox on the right-hand side of the screen to either
        enable or disable an analysis card from view.
        """
        analysis_card_name = self.normalize_identifier_underscore(analysis_card_name)
        button_enable_disable_analysis_card_locator = CohortComparisonLocators.BUTTON_ADD_REMOVE_ANALYSIS_CARD(analysis_card_name)
        self.click(button_enable_disable_analysis_card_locator)

    def is_analysis_card_visible_cohort_comparison(self, analysis_card_name:str):
        analysis_card_locator = CohortComparisonLocators.ANALYSIS_CARD_IDENT(analysis_card_name)
        return self.is_visible(analysis_card_locator)

    def get_case_count_on_save_cohort_button_on_analysis_card_cohort_comparison(self, analysis_card:str, row_name:str, cohort_number:str):
        """
        Returns the case count of the specified cohort on the cohort comparison main screen.
        """
        cohort_number = self.make_input_0_index(cohort_number)
        save_cohort_locator = CohortComparisonLocators.BUTTON_SAVE_COHORT_ANALYSIS_CARD(analysis_card, row_name, cohort_number)
        return self.get_text(save_cohort_locator)

    def click_save_cohort_button_on_analysis_card_cohort_comparison(self, analysis_card:str, row_name:str, cohort_number:str):
        """
        Clicks save a filtered cohort button from an analysis card on the cohort comparison main screen.
        """
        cohort_number = self.make_input_0_index(cohort_number)
        save_cohort_locator = CohortComparisonLocators.BUTTON_SAVE_COHORT_ANALYSIS_CARD(analysis_card, row_name, cohort_number)
        self.click(save_cohort_locator)
