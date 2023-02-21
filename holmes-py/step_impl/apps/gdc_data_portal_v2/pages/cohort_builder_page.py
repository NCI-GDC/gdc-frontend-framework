from playwright.sync_api import Page

from ....base.base_page import BasePage

class CohortBuilderPageLocators:
    BUTTON_IDENT = lambda button_name: f'[data-testid="button-cohort-builder-{button_name}"]'
    BUTTON_GENERIC_IDENT = lambda button_name: f'//button[@data-testid="button-{button_name}"]'
    ARIA_INPUT_CHECKBOX_IDENT = lambda aria_label:f'//input[@aria-label="{aria_label}"]'

    FACET_GROUP_IDENT = lambda group_name: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]'
    FACET_GROUP_SELECTION_IDENT = lambda group_name, selection: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]/..//input[@data-testid="checkbox-{selection}"]'
    FACET_GROUP_ACTION_IDENT = lambda group_name, action: f'//div[@data-testid="title-cohort-builder-facet-groups"]/div[contains(.,"{group_name}")]/.//button[@aria-label="{action}"]'

    CUSTOM_FILTER_ADD_BUTTON = f'[data-testid="button-cohort-builder-add-a-custom-filter"]'
    CUSTOM_FILTER_TABLE_PAGE = f'[data-testid="section-file-filter-search"]'

    SPINNER_IDENT = f'[repeatcount="indefinite"]'

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

    # Adds a custom filter from the Custom Filters tab
    def add_custom_filter(self, facet_to_add):
        add_custom_filter = CohortBuilderPageLocators.CUSTOM_FILTER_ADD_BUTTON
        self.click(add_custom_filter)
        self.wait_for_selector(CohortBuilderPageLocators.CUSTOM_FILTER_TABLE_PAGE)
        custom_filter_to_add = CohortBuilderPageLocators.BUTTON_GENERIC_IDENT(facet_to_add)
        self.click(custom_filter_to_add)

    # Performs an action in a facet group e.g sorting, resetting, flipping the chart, etc.
    def perform_action_within_filter_card(self, facet_group_name, action):
        locator = CohortBuilderPageLocators.FACET_GROUP_ACTION_IDENT(facet_group_name, action)
        self.click(locator)

    # Clicks a checkbox with an aria label and waits for the spinner to 'detach'
    def click_aria_checkbox_with_wait(self, aria_label):
        locator = CohortBuilderPageLocators.ARIA_INPUT_CHECKBOX_IDENT(aria_label)
        self.click(locator)
        self.wait_until_locator_is_detached(CohortBuilderPageLocators.SPINNER_IDENT)
