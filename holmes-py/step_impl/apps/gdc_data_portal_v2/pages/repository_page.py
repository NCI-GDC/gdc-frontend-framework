from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators

class RepositoryPageLocators:
    TITLE = lambda title_name: f'div[data-testid="{title_name}-title"]'
    FILTERS_FACETS = '//div[@data-testid="filters-facets"]/div'
    FACET_BY_NAME = '//div[@data-testid="filters-facets"]//div[text()="Data Category"]/../../..//input[@value="biospecimen"]'
    FILTER_BUTTON_IDENT = lambda button_name: f"[data-testid='button-{button_name}']"
    REPO_BUTTON_IDENT = lambda button_name: f"[data-testid='button-{button_name}-files-table']"
    MODAL_IDENT = lambda modal_name: f"//h3[text()='{modal_name}']/../../.."
    LIST_IDENT = lambda list_name: f"//div[@data-testid='list-{list_name}']"
    FILE_FILTER_SEARCH_BOX = '[data-testid="section-file-filter-search"]>div>div>input'

    IMAGE_VIEWER_IDENT = lambda data_testid: f"[data-testid='{data_testid}-image-viewer']"
    IMAGE_VIEWER_SEARCH_BOX = '[data-testid="search-bar-image-viewer"]'
    IMAGE_VIEWER_MAIN_IMAGE = "div[class='openseadragon-canvas'] >> nth=0"
    IMAGE_VIEWER_VIEWPORT_NAVIGATOR = "div[class='openseadragon-canvas'] >> nth=1"
    IMAGE_VIEWER_SHOWING_NUMBER_OF_CASES = "[data-testid='showing-image-viewer']"
    IMAGE_VIEWER_SEARCH_FILTER = lambda search_filter: f'text="{search_filter}"'

    IMAGE_VIEWER_DETAILS_FIELD = lambda field_name: f'[data-testid="table-image-viewer-details"] >> text={field_name}'
    IMAGE_VIEWER_DETAILS_VALUE = lambda field_name, value: f'[data-testid="table-image-viewer-details"] >> text={field_name}{value} >> td'

    TEXT_REPO_TABLE_CASE_COUNT = lambda case_count: f'div[class="flex justify-between"] >> text="{case_count}"'

class RepositoryPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=Downloads".format(url)
        self.driver = driver  # driver is PW page
        super().__init__(self.driver)

    def visit(self):
        self.driver.goto(self.URL)

    def get_title(self, title_name):
        """Gets the text content of the title"""
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
        """Clicks file filter button and file filter options"""
        self.click(
            RepositoryPageLocators.FILTER_BUTTON_IDENT(
                self.normalize_button_identifier(button_name)
            )
        )

    def click_repository_page_button(self, button_name: str):
        """Clicks specified button on the repository page"""
        self.click(
            RepositoryPageLocators.REPO_BUTTON_IDENT(
                self.normalize_button_identifier(button_name)
            )
        )

    def click_image_viewer_page_data_testid(self, data_testid: str):
        """Clicks specified data_testid on the slide image viewer page"""
        self.click(
            RepositoryPageLocators.IMAGE_VIEWER_IDENT(
                self.normalize_button_identifier(data_testid)
            )
        )

    def compare_cohort_case_count_and_repo_table_case_count(self):
        self.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        self.wait_for_loading_spinner_table_to_detatch()
        cohort_bar_case_count = self.get_text(GenericLocators.TEXT_COHORT_BAR_CASE_COUNT)
        repo_table_case_count_locator = RepositoryPageLocators.TEXT_REPO_TABLE_CASE_COUNT(cohort_bar_case_count)
        return self.is_visible(repo_table_case_count_locator)

    def get_text_on_modal(self, text):
        modal_name = "Add a Custom Filter"
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

    def get_image_viewer_showing_cases_text(self):
        """Returns the text of how many cases are being shown on the slide image viewer page"""
        locator = RepositoryPageLocators.IMAGE_VIEWER_SHOWING_NUMBER_OF_CASES
        return self.get_text(locator)

    def get_search_box_entry(self):
        """Gets search box entry in the filter modal"""
        return self.get_input_value(RepositoryPageLocators.FILE_FILTER_SEARCH_BOX)

    def get_custom_filter_facet_as_applied(self, filter_name: str):
        return self.normalize_applied_filter_name(filter_name)

    def is_detail_field_present(self, field_name):
        """On a slide image, details pop-up, checks if given field is present"""
        field_locator = RepositoryPageLocators.IMAGE_VIEWER_DETAILS_FIELD(field_name)
        return self.is_visible(field_locator)

    def is_detail_value_present(self, field_name, value):
        """On a slide image, details pop-up, checks if given value for field is present"""
        value_locator = RepositoryPageLocators.IMAGE_VIEWER_DETAILS_VALUE(field_name,value)
        return self.is_visible(value_locator)

    def is_slide_image_visible(self):
        """Returns if slide image and upper-viewport navigator is visible"""
        main_image_locator = RepositoryPageLocators.IMAGE_VIEWER_MAIN_IMAGE
        is_main_image_visible = self.is_visible(main_image_locator)
        viewport_nav_locator = RepositoryPageLocators.IMAGE_VIEWER_VIEWPORT_NAVIGATOR
        is_viewport_nav_visible = self.is_visible(viewport_nav_locator)
        return (is_main_image_visible and is_viewport_nav_visible)

    def search_file_filters(self, filter_name: str):
        """Search bar on the filter modal"""
        self.send_keys(RepositoryPageLocators.FILE_FILTER_SEARCH_BOX, filter_name)

    def search_image_viewer(self, image_viewer_search: str):
        """Search bar on the slide image viewer page"""
        self.send_keys(RepositoryPageLocators.IMAGE_VIEWER_SEARCH_BOX, image_viewer_search)

    def select_nth_file_filters_result(self, nth: int):
        list_name = "file-filters"
        locator = f"{RepositoryPageLocators.LIST_IDENT(list_name)}//button//div[1]"
        self.driver.locator(locator).nth(nth).click()

    def remove_slide_image_viewer_search_filter(self, search_filter:str):
        """Removes search filter on the slide image viewer page

        Keyword arguments:
        search_filter - The text of the filter to be removed
        """
        search_filter_locator = RepositoryPageLocators.IMAGE_VIEWER_SEARCH_FILTER(search_filter)
        self.click(search_filter_locator)
