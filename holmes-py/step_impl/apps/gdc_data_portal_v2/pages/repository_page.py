from playwright.sync_api import Page

from ....base.base_page import BasePage


class RepositoryPageLocators:
    TITLE = lambda title_name: f'div[data-testid="{title_name}-title"]'
    FILTERS_FACETS = '//div[@data-testid="filters-facets"]/div'
    FACET_BY_NAME = '//div[@data-testid="filters-facets"]//div[text()="Data Category"]/../../..//input[@value="biospecimen"]'
    FILTER_BUTTON_IDENT = lambda button_name: f"[data-testid='button-{button_name}']"
    REPO_BUTTON_IDENT = lambda button_name: f"[data-testid='button-{button_name}-files-table']"
    MODAL_IDENT = lambda modal_name: f"//h3[text()='{modal_name}']/../../.."
    LIST_IDENT = lambda list_name: f"//div[@data-testid='list-{list_name}']"
    FILE_FILTER_SEARCH_BOX = '[data-testid="section-file-filter-search"]>div>div>input'
    MODAL_CLOSE = "[aria-label='button-close-modal']"

    FACET_GROUP_SELECTION_IDENT = lambda group_name, selection: f'//div[@data-testid="filters-facets"]/div[contains(.,"{group_name}")]/..//input[@data-testid="checkbox-{selection}"]'
    FACET_GROUP_ACTION_IDENT = lambda group_name, action: f'//div[@data-testid="filters-facets"]/div[contains(.,"{group_name}")]/.//button[@aria-label="{action}"]'
    FACET_GROUP_SHOW_MORE_LESS_IDENT = lambda group_name, more_or_less: f'//div[@data-testid="filters-facets"]/div[contains(.,"{group_name}")]/.//button[@data-testid="{more_or_less}"]'

    REPO_TABLE_SPINNER = '//div[@data-testid="repository-table"] >> svg[role="presentation"]'

class RepositoryPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=Downloads".format(url)
        self.driver = driver  # driver is PW page
        super().__init__(self.driver)

    def visit(self):
        self.driver.goto(self.URL)

    def get_title(self, title_name):
        return self.driver.locator(
            RepositoryPageLocators.TITLE(title_name.lower())
        ).text_content()

    def get_filter_facet_names(self):
        filter_names = []
        self.driver.wait_for_selector(
            RepositoryPageLocators.FILTERS_FACETS, state="visible"
        )
        matches = self.driver.locator(RepositoryPageLocators.FILTERS_FACETS).count()
        for i in range(matches):
            nth_inner_element = (
                self.driver.locator(RepositoryPageLocators.FILTERS_FACETS)
                .nth(i)
                .all_inner_texts()
            )
            nth_inner_element = nth_inner_element[0].split("\n")[0]
            filter_names.append(nth_inner_element)
        return filter_names

    def click_button(self, button_name: str):
        self.click(
            RepositoryPageLocators.FILTER_BUTTON_IDENT(
                self.normalize_button_identifier(button_name)
            )
        )

    def click_repository_page_button(self, button_name: str):
        self.click(
            RepositoryPageLocators.REPO_BUTTON_IDENT(
                self.normalize_button_identifier(button_name)
            )
        )

    def get_text_on_modal(self, text):
        modal_name = "Add a File Filter"
        result = None
        try:
            result = self.get_text(
                f"{RepositoryPageLocators.MODAL_IDENT(modal_name)}//*[text()='{text}']"
            )
        except Exception as exc:
            result = self.get_text(
                f"{RepositoryPageLocators.MODAL_IDENT(modal_name)}//*[contains(.,'{text}')]"
            )
        result = result.replace("\n", " ")
        return result

    def get_file_filter_list_count(self):
        list_name = "file-filters"
        locator = RepositoryPageLocators.LIST_IDENT(list_name)
        return self.driver.locator(f"{locator}//button").count()

    def get_file_filter_names(self):
        list_name = "file-filters"
        locator = RepositoryPageLocators.LIST_IDENT(list_name)
        filter_names = self.driver.locator(
            f"{locator}//button//div[1]"
        ).all_text_contents()
        return filter_names

    def search_file_filters(self, filter_name: str):
        self.send_keys(RepositoryPageLocators.FILE_FILTER_SEARCH_BOX, filter_name)

    def get_search_box_entry(self):
        return self.get_input_value(RepositoryPageLocators.FILE_FILTER_SEARCH_BOX)

    def select_nth_file_filters_result(self, nth: int):
        list_name = "file-filters"
        locator = f"{RepositoryPageLocators.LIST_IDENT(list_name)}//button//div[1]"
        self.driver.locator(locator).nth(nth).click()

    def get_custom_filter_facet_as_applied(self, filter_name: str):
        return self.normalize_applied_filter_name(filter_name)

    def close_add_a_file_filter_modal(self):
        self.driver.locator(RepositoryPageLocators.MODAL_CLOSE).click()

    # Clicks a checkbox within a facet group
    def make_selection_within_facet_group(self, facet_group_name, selection):
        locator = RepositoryPageLocators.FACET_GROUP_SELECTION_IDENT(facet_group_name, selection)
        self.click(locator)
        # Not every action causes the spinner to appear. So, we just wait for it to not be detached.
        self.wait_until_locator_is_detached(RepositoryPageLocators.REPO_TABLE_SPINNER)

    # Performs an action in a facet group e.g sorting, resetting, flipping the chart, etc.
    def perform_action_within_filter_card(self, facet_group_name, action):
        locator = RepositoryPageLocators.FACET_GROUP_ACTION_IDENT(facet_group_name, action)
        self.click(locator)
        # Not every action causes the spinner to appear. So, we just wait for it to not be detached.
        self.wait_until_locator_is_detached(RepositoryPageLocators.REPO_TABLE_SPINNER)

    # Clicks the show more or show less object
    def click_show_more_less_within_filter_card(self, facet_group_name, label):
        locator = RepositoryPageLocators.FACET_GROUP_SHOW_MORE_LESS_IDENT(facet_group_name, label)
        self.click(locator)
