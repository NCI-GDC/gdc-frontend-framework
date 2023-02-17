from playwright.sync_api import Page

from ....base.base_page import BasePage

class CohortBuilderPageLocators:
    BUTTON_IDENT = lambda button_name: f'[data-testid="button-cohort-builder-{button_name}"]'
    BUTTON_GENERIC_IDENT = lambda button_name: f'//button[@data-testid="button-{button_name}"]'

    FACET_GROUP_IDENT = lambda group_name: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]'
    FACET_GROUP_SELECTION_IDENT = lambda group_name, selection: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]/..//input[@data-testid="checkbox-{selection}"]'

    CUSTOM_FILTER_ADD_BUTTON = f'[data-testid="button-cohort-builder-add-a-custom-filter"]'
    CUSTOM_FILTER_TABLE_PAGE = f'[data-testid="section-file-filter-search"]'

    DATA_TEST_ID = lambda id: f'[data-testid="{id}"]'

    # PEAR-1085 has been made to give this a unique data-testid
    SEARCH_BAR = f'input[placeholder="Search"]'
    SEARCH_BAR_RESULT_AREA_MARK = lambda text: f'mark:text("{text}")'
    SEARCH_BAR_RESULT_AREA_SPAN = lambda text: f'span:text("{text}")'


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
        result = self.is_visible(locator)
        return result

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
        data_testid_locator = CohortBuilderPageLocators.DATA_TEST_ID(search_bar_text_to_check)
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

    # Adds a custom filter from the Custom Filters tab
    def add_custom_filter(self, facet_to_add):
        add_custom_filter = CohortBuilderPageLocators.CUSTOM_FILTER_ADD_BUTTON
        self.click(add_custom_filter)
        self.wait_for_selector(CohortBuilderPageLocators.CUSTOM_FILTER_TABLE_PAGE)
        custom_filter_to_add = CohortBuilderPageLocators.BUTTON_GENERIC_IDENT(facet_to_add)
        self.click(custom_filter_to_add)
