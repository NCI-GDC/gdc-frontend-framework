from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

import time

class CohortCaseViewLocators:
    BUTTON_EXPAND_COLLAPSE_COHORT_BAR = '[data-testid="button-cases-cohort-bar"]'

    BUTTON_CASE_VIEW = lambda button_name: f'[data-testid="button-{button_name}-cases-summary"]'
    BUTTON_FILES_CASE_VIEW = '[data-testid="button-files-cases-summary"]'

    BUTTON_BIOSPECIMEN_SUMMARY_VIEW = '[data-testid="button-biospecimen-cases-summary"]'
    BUTTON_CLINICAL_SUMMARY_VIEW = '[data-testid="button-clinical-cases-summary"]'

    BUTTON_TABLE_VIEW = lambda button_name: f'[data-testid="button-{button_name}-cases-table"]'

    FILTER_GROUP_IDENT = (
        lambda group_name: f'[data-testid="filters-facets-summary-view"] >> div:nth-child(1) >> div:text-is("{group_name}")'
    )
    FILTER_GROUP_SELECTION_IDENT = (
        lambda group_name, selection: f'[data-testid="filters-facets-summary-view"] >> div:nth-child(1) >> div:has-text("{group_name}") >> [data-testid="checkbox-{selection}"]'
    )
    FILTER_GROUP_SELECTION_COUNT_IDENT = (
        lambda group_name, selection: f'[data-testid="filters-facets-summary-view"] >> div:nth-child(1) >> div:has-text("{group_name}") >> [data-testid="text-{selection}"]'
    )
    FILTER_GROUP_ACTION_IDENT = (
        lambda group_name, action: f'[data-testid="filters-facets-summary-view"] >> div:nth-child(1) >> div:has-text("{group_name}") >> button[aria-label="{action}"]'
    )
    FILTER_GROUP_SHOW_MORE_LESS_IDENT = (
        lambda group_name, more_or_less: f'[data-testid="filters-facets-summary-view"] >> div:nth-child(1) >> div:has-text("{group_name}") >> button[data-testid="{more_or_less}"]'
    )

class CohortCaseViewPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def click_expand_collapse_cohort_bar(self):
        """Clicks expand/collapse cohort bar button"""
        locator = CohortCaseViewLocators.BUTTON_EXPAND_COLLAPSE_COHORT_BAR
        self.click(locator)
        self.wait_for_loading_spinners_to_detach()

    def click_tab_name(self, tab_name):
        """Clicks tab in cohort case view area"""
        tab_name = self.normalize_button_identifier(tab_name)
        self.click_button_data_testid(tab_name)
        self.wait_for_loading_spinners_to_detach()

    def click_files_and_dropdown_option_cases_view(self, dropdown_option):
        locator = CohortCaseViewLocators.BUTTON_FILES_CASE_VIEW
        self.click(locator)
        self.click_text_option_from_dropdown_menu(dropdown_option)

    def click_summary_view_button(self, button_name):
        """Clicks button that ends in 'cases-summary' """
        button_name = self.normalize_button_identifier(button_name)
        locator = CohortCaseViewLocators.BUTTON_CASE_VIEW(button_name)
        self.click(locator)

    def click_biospecimen_summary_view(self, dropdown_option):
        locator = CohortCaseViewLocators.BUTTON_BIOSPECIMEN_SUMMARY_VIEW
        self.click(locator)
        self.click_text_option_from_dropdown_menu(dropdown_option)

    def click_clinical_summary_view(self, dropdown_option):
        locator = CohortCaseViewLocators.BUTTON_CLINICAL_SUMMARY_VIEW
        self.click(locator)
        self.click_text_option_from_dropdown_menu(dropdown_option)

    def click_table_view_button(self, button_name):
        """Clicks button that ends in 'cases-table' """
        button_name = self.normalize_button_identifier(button_name)
        locator = CohortCaseViewLocators.BUTTON_TABLE_VIEW(button_name)
        self.click(locator)

    def get_filter_selection_count(self, filter_group_name, selection):
        """Returns the count of how many items are associated with that filter in the current cohort"""
        locator = CohortCaseViewLocators.FILTER_GROUP_SELECTION_COUNT_IDENT(
            filter_group_name, selection
        )
        return self.get_text(locator)

    def is_filter_card_present(self, filter_group_name):
        """Returns if specified filter card is present"""
        locator = CohortCaseViewLocators.FILTER_GROUP_IDENT(filter_group_name)
        return self.is_visible(locator)

    def is_aria_label_present_within_filter_card(self, filter_group_name, aria_label):
        """Returns if specified aria label is present"""
        locator = CohortCaseViewLocators.FILTER_GROUP_ACTION_IDENT(filter_group_name, aria_label)
        return self.is_visible(locator)

    def is_show_more_or_show_less_button_visible_within_filter_card(self, filter_group_name, label):
        """Returns if the 'show more or show less' button is visible on a filter card"""
        locator = CohortCaseViewLocators.FILTER_GROUP_SHOW_MORE_LESS_IDENT(
            filter_group_name, label
        )
        return self.is_visible(locator)

    def make_selection_within_filter_group(self, filter_group_name, selection):
        """Clicks a checkbox within a filter group"""
        locator = CohortCaseViewLocators.FILTER_GROUP_SELECTION_IDENT(
            filter_group_name, selection
        )
        self.click(locator)

    def perform_action_within_filter_card(self, filter_group_name, action):
        """Performs an action in a filter group e.g sorting, resetting, flipping the chart, etc."""
        locator = CohortCaseViewLocators.FILTER_GROUP_ACTION_IDENT(filter_group_name, action)
        self.click(locator)

    def click_show_more_less_within_filter_card(self, filter_group_name, label):
        """Clicks the show more or show less object"""
        locator = CohortCaseViewLocators.FILTER_GROUP_SHOW_MORE_LESS_IDENT(
            filter_group_name, label
        )
        self.click(locator)
