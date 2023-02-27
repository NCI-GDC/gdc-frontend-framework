from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators
class CohortBuilderPageLocators:
    BUTTON_IDENT = lambda button_name: f'[data-testid="button-cohort-builder-{button_name}"]'

    CUSTOM_FILTER_ADD_BUTTON = f'[data-testid="button-cohort-builder-add-a-custom-filter"]'
    CUSTOM_FILTER_TABLE_PAGE = f'[data-testid="section-file-filter-search"]'

    FACET_GROUP_IDENT = lambda group_name: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]'
    FACET_GROUP_SELECTION_IDENT = lambda group_name, selection: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]/..//input[@data-testid="checkbox-{selection}"]'
    FACET_GROUP_ACTION_IDENT = lambda group_name, action: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]/.//button[@aria-label="{action}"]'
    FACET_GROUP_TEXT_AREA_IDENT = lambda group_name, area: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]/.//input[@aria-label="{area}"]'
    FACET_GROUP_SHOW_MORE_LESS_IDENT = lambda group_name, more_or_less: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]/.//button[@data-testid="{more_or_less}"]'
    FACET_GROUP_NAMED_OBJECT_IDENT = lambda group_name, object_name: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]/.//div >> text="{object_name}"'

    QUERY_EXPRESSION_TEXT = lambda text: f'div:text("{text}")'


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

    # Clicks a checkbox within a facet group
    def make_selection_within_facet_group(self, facet_group_name, selection):
        locator = CohortBuilderPageLocators.FACET_GROUP_SELECTION_IDENT(facet_group_name, selection)
        self.click(locator)

    # Checks to see if specified facet card is present
    def check_facet_card_presence(self, facet_group_name):
        locator = CohortBuilderPageLocators.FACET_GROUP_IDENT(facet_group_name)
        result = self.is_visible(locator)
        return result

    # Performs an action in a facet group e.g sorting, resetting, flipping the chart, etc.
    def perform_action_within_filter_card(self, facet_group_name, action):
        locator = CohortBuilderPageLocators.FACET_GROUP_ACTION_IDENT(facet_group_name, action)
        self.click(locator)

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

    # Adds a custom filter from the Custom Filters tab
    def add_custom_filter(self, facet_to_add):
        add_custom_filter = CohortBuilderPageLocators.CUSTOM_FILTER_ADD_BUTTON
        self.click(add_custom_filter)
        self.driver.wait_for_selector(CohortBuilderPageLocators.CUSTOM_FILTER_TABLE_PAGE, state="visible")
        custom_filter_to_add = GenericLocators.BUTTON_GENERIC_IDENT(facet_to_add)
        self.click(custom_filter_to_add)
