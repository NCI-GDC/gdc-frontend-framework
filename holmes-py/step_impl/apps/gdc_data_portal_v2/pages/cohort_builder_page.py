import random

from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

class CohortBuilderPageLocators:
    BUTTON_IDENT = lambda button_name: f'[data-testid="button-cohort-builder-{button_name}"]'

    CUSTOM_FILTER_ADD_BUTTON = f'[data-testid="button-cohort-builder-add-a-custom-filter"]'
    CUSTOM_FILTER_TABLE_PAGE = f'[data-testid="section-file-filter-search"]'

    FACET_GROUP_IDENT = lambda group_name: f'[data-testid="title-cohort-builder-facet-groups"] >> div:text-is("{group_name}")'
    FACET_GROUP_SELECTION_IDENT = lambda group_name, selection: f'[data-testid="title-cohort-builder-facet-groups"] >> div:has-text("{group_name}") >> [data-testid="checkbox-{selection}"]'
    FACET_GROUP_ACTION_IDENT = lambda group_name, action: f'[data-testid="title-cohort-builder-facet-groups"] >> div:has-text("{group_name}") >> button[aria-label="{action}"]'
    FACET_GROUP_TEXT_AREA_IDENT = lambda group_name, area: f'[data-testid="title-cohort-builder-facet-groups"] >> div:has-text("{group_name}") >> input[aria-label="{area}"]'
    FACET_GROUP_SHOW_MORE_LESS_IDENT = lambda group_name, more_or_less: f'[data-testid="title-cohort-builder-facet-groups"] >> div:has-text("{group_name}") >> button[data-testid="{more_or_less}"]'
    FACET_GROUP_NAMED_OBJECT_IDENT = lambda group_name, object_name: f'[data-testid="title-cohort-builder-facet-groups"] >> div:has-text("{group_name}") >> div >> text="{object_name}"'

    FILTER_TAB_LIST = 'main[data-tour="full_page_content"] >> div[role="tablist"] > button'
    FILTER_TAB_LIST_BUTTON = lambda tab_position: f'main[data-tour="full_page_content"] >> div[role="tablist"] > button:nth-child({tab_position})'
    FACET_CARD_LIST = '[data-testid="title-cohort-builder-facet-groups"] > div'
    FILTER_LIST = lambda facet_card_position: f'[data-testid="title-cohort-builder-facet-groups"] > div:nth-child({facet_card_position}) >> div[aria-label="Filter values"] > div'
    FILTER_LIST_CHECKBOX = lambda facet_card_position, filter_checkbox_position: f'[data-testid="title-cohort-builder-facet-groups"] > div:nth-child({facet_card_position}) >> div[aria-label="Filter values"] > > div:nth-child({filter_checkbox_position}) >> input'

    CUSTOM_FILTER_ADD_BUTTON = f'[data-testid="button-cohort-builder-add-a-custom-filter"]'
    CUSTOM_FILTER_TABLE_PAGE = f'[data-testid="section-file-filter-search"]'

    # PEAR-1085 has been made to give this a unique data-testid.
    # TO-DO: When unique IDs have been added, update these locators.
    SEARCH_BAR = f'input[placeholder="Search"]'
    SEARCH_BAR_RESULT_AREA_MARK = lambda text: f'mark:text("{text}")'
    SEARCH_BAR_RESULT_AREA_SPAN = lambda text: f'span:text("{text}")'
    QUERY_EXPRESSION_TEXT = lambda text: f'div:text("{text}")'

    ONLY_SHOW_PROPERTIES_WITH_VALUES_CHECKBOX_IDENT = '//input[@aria-label="show only properties with values"]'

class CohortBuilderPage(BasePage):

    def __init__(self, driver: Page, url) -> None:
        super().__init__(driver)
        self.driver = driver
        self.URL = "{}/analysis_page?app=CohortBuilder".format(url)

    def navigate(self):
        self.goto(self.URL)

    def click_button(self, button_name:str) -> None:
        locator = CohortBuilderPageLocators.BUTTON_IDENT(self.normalize_button_identifier(button_name))
        self.click(locator)

    # Checks to see if specified facet card is present
    def check_facet_card_presence(self, facet_group_name):
        locator = CohortBuilderPageLocators.FACET_GROUP_IDENT(facet_group_name)
        try:
            self.wait_until_locator_is_visible(locator)
        except:
            return False
        return True

    # Adds a custom filter from the Custom Filters tab
    def add_custom_filter(self, facet_to_add):
        add_custom_filter = CohortBuilderPageLocators.CUSTOM_FILTER_ADD_BUTTON
        self.click(add_custom_filter)
        self.wait_for_selector(CohortBuilderPageLocators.CUSTOM_FILTER_TABLE_PAGE)
        custom_filter_to_add = GenericLocators.DATA_TESTID_BUTTON_IDENT(facet_to_add)
        self.click(custom_filter_to_add)

    # Clicks a checkbox within a facet group
    def make_selection_within_facet_group(self, facet_group_name, selection):
        locator = CohortBuilderPageLocators.FACET_GROUP_SELECTION_IDENT(facet_group_name, selection)
        self.click(locator)

    # Send keys in the search bar
    def send_text_into_search_bar(self, text):
        locator = CohortBuilderPageLocators.SEARCH_BAR
        self.send_keys(locator, text)

    # Checks the text in the search bar result area
    def validate_search_bar_result(self,search_bar_text_to_check):
        mark_locator = CohortBuilderPageLocators.SEARCH_BAR_RESULT_AREA_MARK(search_bar_text_to_check)
        span_locator = CohortBuilderPageLocators.SEARCH_BAR_RESULT_AREA_SPAN(search_bar_text_to_check)
        data_testid_locator = GenericLocators.DATA_TEST_ID_IDENT(search_bar_text_to_check)
        # The text result can be in multiple forms. If any of the forms are visible, then we return true
        result = (self.is_visible(mark_locator) or self.is_visible(span_locator) or self.is_visible(data_testid_locator))
        return result

    # Click on the search bar result text to travel to the facet
    def click_on_search_bar_result(self,search_bar_text_to_click):
        mark_locator = CohortBuilderPageLocators.SEARCH_BAR_RESULT_AREA_MARK(search_bar_text_to_click)
        span_locator = CohortBuilderPageLocators.SEARCH_BAR_RESULT_AREA_SPAN(search_bar_text_to_click)
        # The text result can be in multiple forms. We want to click on whatever one appears
        if self.is_visible(mark_locator):
            self.click(mark_locator)
        elif self.is_visible(span_locator):
            self.click(span_locator)

    # Performs an action in a facet group e.g sorting, resetting, flipping the chart, etc.
    def perform_action_within_filter_card(self, facet_group_name, action):
        locator = CohortBuilderPageLocators.FACET_GROUP_ACTION_IDENT(facet_group_name, action)
        self.click(locator)

    # Clicks a checkbox with an aria label and waits for the spinner to 'detach'
    def click_only_show_properties_with_values_checkbox(self):
        locator = CohortBuilderPageLocators.ONLY_SHOW_PROPERTIES_WITH_VALUES_CHECKBOX_IDENT
        self.click(locator)
        self.wait_for_loading_spinner_to_be_visible()
        self.wait_for_loading_spinner_to_detatch()

    # Returns if the show more or show less button is visible on a facet card
    def is_show_more_or_show_less_button_visible_within_filter_card(self, facet_group_name, label):
        locator = CohortBuilderPageLocators.FACET_GROUP_SHOW_MORE_LESS_IDENT(facet_group_name, label)
        return self.is_visible(locator)

    # Clicks the show more or show less object
    def click_show_more_less_within_filter_card(self, facet_group_name, label):
        locator = CohortBuilderPageLocators.FACET_GROUP_SHOW_MORE_LESS_IDENT(facet_group_name, label)
        self.click(locator)

    # Send keys in the search textbox area
    def type_in_facet_search_text_area(self, facet_group_name, label, text):
        locator = CohortBuilderPageLocators.FACET_GROUP_TEXT_AREA_IDENT(facet_group_name, label)
        self.send_keys(locator, text)

    # Used to check the text displayed in the query expression area
    def is_query_expression_area_text_present(self, text):
        locator = CohortBuilderPageLocators.QUERY_EXPRESSION_TEXT(text)
        result = self.is_visible(locator)
        return result

    # Clicks a filter card object using its visible, displayed name
    def click_named_item_in_facet_group(self, facet_group_name, object_name):
        locator = CohortBuilderPageLocators.FACET_GROUP_NAMED_OBJECT_IDENT(facet_group_name, object_name)
        self.click(locator)

    def click_random_tab_in_cohort_builder(self):
        tab_list_locator = CohortBuilderPageLocators.FILTER_TAB_LIST
        number_of_tabs = self.get_count(tab_list_locator)
        # random.range is inclusive at start and exclusive at stop.
        # That is fine, we do not want to select the last tab (Custom Filters)
        random_tab_to_select = random.randrange(1,number_of_tabs,1)
        tab_locator = CohortBuilderPageLocators.FILTER_TAB_LIST_BUTTON(random_tab_to_select)
        self.click(tab_locator)
