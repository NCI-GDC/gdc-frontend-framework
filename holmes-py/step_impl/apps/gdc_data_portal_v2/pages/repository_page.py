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

    IMAGE_VIEWER_IDENT = lambda data_testid: f"[data-testid='{data_testid}-image-viewer']"
    IMAGE_VIEWER_SEARCH_BOX = '[data-testid="search-bar-image-viewer"]'
    IMAGE_VIEWER_MAIN_IMAGE = "div[class='openseadragon-canvas'] >> nth=0"
    IMAGE_VIEWER_VIEWPORT_NAVIGATOR = "div[class='openseadragon-canvas'] >> nth=1"
    IMAGE_VIEWER_SHOWING_NUMBER_OF_CASES = "[data-testid='showing-image-viewer']"
    IMAGE_VIEWER_SEARCH_FILTER = lambda search_filter: f'text="{search_filter}"'

    IMAGE_VIEWER_DETAILS_FIELD = lambda field_name: f'[data-testid="details-image-viewer"] >> text={field_name}'
    IMAGE_VIEWER_DETAILS_VALUE = lambda field_name, value: f'[data-testid="details-image-viewer"] >> text={field_name}{value} >> td'

    REPO_TABLE_SPINNER = '//div[@data-testid="repository-table"] >> svg[role="presentation"]'

class RepositoryPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=Downloads".format(url)
        self.driver = driver  # driver is PW page
        super().__init__(self.driver)

    def visit(self):
        self.driver.goto(self.URL)

    # Gets the text content of the title
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

    # Clicks file filter button and file filter options
    def click_button(self, button_name: str):
        self.click(
            RepositoryPageLocators.FILTER_BUTTON_IDENT(
                self.normalize_button_identifier(button_name)
            )
        )

    # Clicks specified button on the repository page
    def click_repository_page_button(self, button_name: str):
        self.click(
            RepositoryPageLocators.REPO_BUTTON_IDENT(
                self.normalize_button_identifier(button_name)
            )
        )

    # Clicks specified data_testid on the slide image viewer page
    def click_image_viewer_page_data_testid(self, data_testid: str):
        self.click(
            RepositoryPageLocators.IMAGE_VIEWER_IDENT(
                self.normalize_button_identifier(data_testid)
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

    # Returns the text of how many cases are being shown on the slide image viewer page
    def get_image_viewer_showing_cases_text(self):
        locator = RepositoryPageLocators.IMAGE_VIEWER_SHOWING_NUMBER_OF_CASES
        return self.get_text(locator)

    # Gets search box entry in the filter modal
    def get_search_box_entry(self):
        return self.get_input_value(RepositoryPageLocators.FILE_FILTER_SEARCH_BOX)

    def get_custom_filter_facet_as_applied(self, filter_name: str):
        return self.normalize_applied_filter_name(filter_name)

    # On a slide image, details pop-up, checks if given field is present
    def is_detail_field_present(self, field_name):
        field_locator = RepositoryPageLocators.IMAGE_VIEWER_DETAILS_FIELD(field_name)
        return self.is_visible(field_locator)

    # On a slide image, details pop-up, checks if given value for field is present
    def is_detail_value_present(self, field_name, value):
        value_locator = RepositoryPageLocators.IMAGE_VIEWER_DETAILS_VALUE(field_name,value)
        return self.is_visible(value_locator)

    # Returns if slide image and upper-viewport navigator is visible
    def is_slide_image_visible(self):
        main_image_locator = RepositoryPageLocators.IMAGE_VIEWER_MAIN_IMAGE
        is_main_image_visible = self.is_visible(main_image_locator)
        viewport_nav_locator = RepositoryPageLocators.IMAGE_VIEWER_VIEWPORT_NAVIGATOR
        is_viewport_nav_visible = self.is_visible(viewport_nav_locator)
        return (is_main_image_visible and is_viewport_nav_visible)

    # Search bar on the filter modal
    def search_file_filters(self, filter_name: str):
        self.send_keys(RepositoryPageLocators.FILE_FILTER_SEARCH_BOX, filter_name)

    # Search bar on the slide image viewer page
    def search_image_viewer(self, image_viewer_search: str):
        self.send_keys(RepositoryPageLocators.IMAGE_VIEWER_SEARCH_BOX, image_viewer_search)

    def select_nth_file_filters_result(self, nth: int):
        list_name = "file-filters"
        locator = f"{RepositoryPageLocators.LIST_IDENT(list_name)}//button//div[1]"
        self.driver.locator(locator).nth(nth).click()

    def close_add_a_file_filter_modal(self):
        self.driver.locator(RepositoryPageLocators.MODAL_CLOSE).click()

    # Removes search filter on the slide image viewer page
    # search_filter - The text of the filter to be removed
    def remove_slide_image_viewer_search_filter(self, search_filter:str):
        search_filter_locator = RepositoryPageLocators.IMAGE_VIEWER_SEARCH_FILTER(search_filter)
        self.click(search_filter_locator)

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
