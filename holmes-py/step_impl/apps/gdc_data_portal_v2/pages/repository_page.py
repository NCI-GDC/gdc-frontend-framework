from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators


class RepositoryPageLocators:
    TITLE = lambda title_name: f'[data-testid="{title_name}-title"]'
    FILTERS_FACETS = '[data-testid="filters-facets"] > div'
    FILTER_BUTTON_IDENT = lambda button_name: f"[data-testid='button-{button_name}']"
    REPO_BUTTON_IDENT = (
        lambda button_name: f"[data-testid='button-{button_name}-files-table']"
    )
    MODAL_ADD_CUSTOM_FILTER_IDENT = "[data-testid='modal-repository-add-custom-filter']"
    LIST_IDENT = lambda list_name: f"//div[@data-testid='list-{list_name}']"
    FILE_FILTER_SEARCH_BOX = '[data-testid="textbox-search-for-a-property"]'

    FILTER_GROUP_SHOW_MORE_LESS_IDENT = (
        lambda group_name, more_or_less: f'[data-testid="filters-facets"] >> div:has-text("{group_name}") >> button[data-testid="{more_or_less}"]'
    )
    FACET_GROUP_FILTER_TEXT_CASE_COUNT = (
        lambda group_name, selection: f'[data-testid="filters-facets"] >> div:has-text("{group_name}") >> [data-testid="text-{selection}"]'
    )
    IMAGE_VIEWER_IDENT = (
        lambda data_testid: f"[data-testid='{data_testid}-image-viewer']"
    )
    IMAGE_VIEWER_CASES_SLIDES = (
        lambda data_testid: f'[data-testid="cases-slides-image-viewer"] >> [data-testid="{data_testid}"]'
    )
    IMAGE_VIEWER_SEARCH_BOX = '[data-testid="search-bar-image-viewer"]'
    IMAGE_VIEWER_MAIN_IMAGE = "div[class='openseadragon-canvas'] >> nth=0"
    IMAGE_VIEWER_VIEWPORT_NAVIGATOR = "div[class='openseadragon-canvas'] >> nth=1"
    IMAGE_VIEWER_SHOWING_NUMBER_OF_CASES = "[data-testid='showing-image-viewer']"
    IMAGE_VIEWER_SEARCH_FILTER = lambda search_filter: f'text="{search_filter}"'

    IMAGE_VIEWER_DETAILS_FIELD = (
        lambda field_name: f'[data-testid="table-image-viewer-details"] >> text={field_name}'
    )
    IMAGE_VIEWER_DETAILS_VALUE = (
        lambda field_name, value: f'[data-testid="table-image-viewer-details"] >> text={field_name}{value} >> td'
    )

    TEXT_REPO_TABLE_ITEM_COUNT = (
        lambda item_position: f'[data-testid="text-counts-files-table"] >> strong >> nth={item_position}'
    )


class RepositoryPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=Downloads".format(url)
        self.driver = driver  # driver is PW page
        super().__init__(self.driver)

    def visit(self):
        self.driver.goto(self.URL)

    def get_repository_table_item_count(self, item):
        """
        Returns specified item count displayed on top of the repository table.
        Displayed are the total Files, Cases, and Size counts of the objects actively shown in the repository table.

        :param item: The item to collect the count of. Options: Files, Cases, or Size
        """
        item = item.lower()
        # I could not place a specific data-testid on each of the counts by themselves. I could
        # only make a data-testid in the block of text that contains all 3 item counts.

        # So, we will return the item count requested based on the position. In the DOM,
        # files is first, cases is second, and size is third. I am using the data-testid I was able to make,
        # and drilling down from there to return desired item count.
        if item == "files":
            item_position = 0
        elif item == "cases":
            item_position = 1
        elif item == "size":
            item_position = 2
        else:
            item_position = "Invalid Item Requested"
        locator = RepositoryPageLocators.TEXT_REPO_TABLE_ITEM_COUNT(item_position)
        return self.get_text(locator)

    def get_file_count_from_filter_within_facet_group(
        self, facet_group_name, filter_name
    ):
        """Returns the file count of a filter on a given facet card"""
        locator = RepositoryPageLocators.FACET_GROUP_FILTER_TEXT_CASE_COUNT(
            facet_group_name, filter_name
        )
        return self.get_text(locator)

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

    # Returns if the show more or show less button is visible on a facet card
    def is_show_more_or_show_less_button_visible_within_filter_card_repository(
        self, facet_group_name, label
    ):
        locator = RepositoryPageLocators.FILTER_GROUP_SHOW_MORE_LESS_IDENT(
            facet_group_name, label
        )
        return self.is_visible(locator)

    def click_show_more_less_within_filter_card_repository(
        self, filter_group_name, label
    ):
        """Clicks the show more or show less object"""
        locator = RepositoryPageLocators.FILTER_GROUP_SHOW_MORE_LESS_IDENT(
            filter_group_name, label
        )
        self.click(locator)

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

    def click_image_viewer_page_case_or_slide(self, data_testid: str):
        """Clicks given case or slide on the slide image viewer page"""
        # IDs are all in upper case
        data_testid = data_testid.upper()
        locator = RepositoryPageLocators.IMAGE_VIEWER_CASES_SLIDES(data_testid)
        self.click(locator)

    def get_text_on_add_custom_filter_modal(self, text):
        result = None
        try:
            locator = f"{RepositoryPageLocators.MODAL_ADD_CUSTOM_FILTER_IDENT} >> text='{text}'"
            self.wait_until_locator_is_visible(locator)
            result = self.get_text(locator)
            result = result.replace("\n", " ")
        except:
            return result
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
        value_locator = RepositoryPageLocators.IMAGE_VIEWER_DETAILS_VALUE(
            field_name, value
        )
        return self.is_visible(value_locator)

    def is_slide_image_visible(self):
        """Returns if slide image and upper-viewport navigator is visible"""
        main_image_locator = RepositoryPageLocators.IMAGE_VIEWER_MAIN_IMAGE
        is_main_image_visible = self.is_visible(main_image_locator)
        viewport_nav_locator = RepositoryPageLocators.IMAGE_VIEWER_VIEWPORT_NAVIGATOR
        is_viewport_nav_visible = self.is_visible(viewport_nav_locator)
        return is_main_image_visible and is_viewport_nav_visible

    def search_file_filters(self, filter_name: str):
        """Search bar on the filter modal"""
        self.send_keys(RepositoryPageLocators.FILE_FILTER_SEARCH_BOX, filter_name)

    def search_image_viewer(self, image_viewer_search: str):
        """Search bar on the slide image viewer page"""
        self.send_keys(
            RepositoryPageLocators.IMAGE_VIEWER_SEARCH_BOX, image_viewer_search
        )

    def select_nth_file_filters_result(self, nth: int):
        list_name = "file-filters"
        locator = f"{RepositoryPageLocators.LIST_IDENT(list_name)}//button//div[1]"
        self.driver.locator(locator).nth(nth).click()

    def remove_slide_image_viewer_search_filter(self, search_filter: str):
        """Removes search filter on the slide image viewer page

        Keyword arguments:
        search_filter - The text of the filter to be removed
        """
        search_filter_locator = RepositoryPageLocators.IMAGE_VIEWER_SEARCH_FILTER(
            search_filter
        )
        self.click(search_filter_locator)
