from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators


class CohortBarLocators:
    COHORT_BAR_BUTTON = lambda button_name: f'[data-testid="{button_name}Button"]'

    COHORT_FROM_DROPDOWN_LIST = (
        lambda cohort_name: f'[data-testid="cohort-list-dropdown"] >> text="{cohort_name}"'
    )
    ACTIVE_COHORT = (
        lambda cohort_name: f'[data-testid="cohort-list-dropdown"] >> input[value="{cohort_name}"]'
    )

    IMPORT_COHORT_MODAL = 'text="Import a New Cohort"'

    SET_AS_COHORT_BUTTON_TEMP_COHORT_MESSAGE = (
        'span:has-text("Set this as your current cohort.")'
    )
    X_BUTTON_IN_TEMP_COHORT_MESSAGE = (
        '>> .. >> .. >> .. >> svg[xmlns="http://www.w3.org/2000/svg"]'
    )

    TEXT_COHORT_QUERY_FILTER = (
        lambda full_query_filter, position: f'[data-testid="text-cohort-filters"] > div:nth-child({position}) > div:has-text("{full_query_filter}") >> nth=0'
    )
    TEXT_COHORT_QUERY_FILTER_ALTERNATIVE_CHECK = (
        lambda full_query_filter, position: f'[data-testid="text-cohort-filters"] > div:nth-child({position}) >> text={full_query_filter} >> nth=0'
    )
    TEXT_COHORT_QUERY_FILTER_CHECK_WHOLE_AREA = (
        lambda full_query_filter: f'[data-testid="text-cohort-filters"] > div:has-text("{full_query_filter}") >> nth=0'
    )
    TEXT_COHORT_QUERY_FILTER_ALTERNATIVE_CHECK_WHOLE_AREA = (
        lambda full_query_filter: f'[data-testid="text-cohort-filters"] >> text={full_query_filter} >> nth=0'
    )
    BUTTON_REMOVE_COHORT_QUERY_FILTER = (
        lambda query_name_to_remove: f'[aria-label="remove {query_name_to_remove}"]'
    )


class CohortBar(BasePage):
    def __init__(self, driver: Page, url) -> None:
        super().__init__(driver)
        self.driver = driver
        self.URL = "{}/analysis_page?app=CohortBuilder".format(url)

    def navigate(self):
        self.goto(self.URL)

    # Clicks a button on the actual cohort bar
    def click_cohort_bar_button(self, button_name: str):
        locator = CohortBarLocators.COHORT_BAR_BUTTON(
            self.normalize_button_identifier(button_name)
        )
        self.click(locator)

    # Clicks the 'x' to remove a specified filter in the cohort query area
    def click_remove_filter_from_cohort_query_area(self, filter_name_to_remove: str):
        locator = CohortBarLocators.BUTTON_REMOVE_COHORT_QUERY_FILTER(
            filter_name_to_remove
        )
        self.click(locator)

    def select_cohort_from_dropdown(self, cohort_name: str):
        locator = CohortBarLocators.COHORT_FROM_DROPDOWN_LIST(cohort_name)
        self.click(locator)

    def is_cohort_visible_in_dropdown_list(self, cohort_name: str):
        locator = CohortBarLocators.COHORT_FROM_DROPDOWN_LIST(cohort_name)
        is_cohort_visible = self.is_visible(locator)
        return is_cohort_visible

    # Clicks "Set this as your current cohort." in the temp message
    def click_set_as_current_cohort_from_temp_message(self):
        locator = CohortBarLocators.SET_AS_COHORT_BUTTON_TEMP_COHORT_MESSAGE
        self.click(locator)

    def is_expected_active_cohort_present(self, cohort_name: str):
        locator = CohortBarLocators.ACTIVE_COHORT(cohort_name)
        return self.is_visible(locator)

    def is_cohort_query_filter_present(self, filter, values, position):
        """
        is_cohort_query_filter_present returns if the given query filter is present
        in the cohort query filter area

        :param filter: The filter category
        :param values: The values being filtered in the category
        :param position: In what part of the query area is being checked for the filter (e.g 1,7,4,etc)
        :return: True or False is the filter present
        """
        # Concatenate the full text of the filter being checked for
        full_query_filter = filter + values
        full_query_filter_locator = CohortBarLocators.TEXT_COHORT_QUERY_FILTER(
            full_query_filter, position
        )
        is_full_query_filter_locator_visible = self.is_visible(
            full_query_filter_locator
        )
        # Some query filter text can appear differently. As such, if we don't find it at first
        # we attempt another way to search for it and return that value.
        if not is_full_query_filter_locator_visible:
            full_query_filter_alt_locator = (
                CohortBarLocators.TEXT_COHORT_QUERY_FILTER_ALTERNATIVE_CHECK(
                    full_query_filter, position
                )
            )
            is_full_query_filter_locator_alt_visible = self.is_visible(
                full_query_filter_alt_locator
            )
            return is_full_query_filter_locator_alt_visible
        else:
            return is_full_query_filter_locator_visible

    def is_cohort_query_filter_not_present(self, filter, values):
        """
        is_cohort_query_filter_present returns if the given query filter is not present
        anywhere in the cohort query filter area

        :param filter: The filter category
        :param values: The values being filtered in the category
        :return: True or False is the filter present
        """
        # Concatenate the full text of the filter being checked for
        full_query_filter = filter + values
        full_query_filter_locator = (
            CohortBarLocators.TEXT_COHORT_QUERY_FILTER_CHECK_WHOLE_AREA(
                full_query_filter
            )
        )
        is_full_query_filter_locator_visible = self.is_visible(
            full_query_filter_locator
        )
        # Some query filter text can appear differently. As such, if we don't find it at first
        # we attempt another way to search for it and return that value.
        if not is_full_query_filter_locator_visible:
            full_query_filter_alt_locator = (
                CohortBarLocators.TEXT_COHORT_QUERY_FILTER_ALTERNATIVE_CHECK_WHOLE_AREA(
                    full_query_filter
                )
            )
            is_full_query_filter_locator_alt_visible = self.is_visible(
                full_query_filter_alt_locator
            )
            return is_full_query_filter_locator_alt_visible
        else:
            return is_full_query_filter_locator_visible

        return is_full_query_filter_locator_visible

    def is_cohort_bar_button_disabled(self, button_name: str):
        """Returns if the cohort bar button has the attribute 'disabled'"""
        locator = CohortBarLocators.COHORT_BAR_BUTTON(
            self.normalize_button_identifier(button_name)
        )
        return self.is_disabled(locator)

    # After import cohort button has been clicked, we make sure the correct modal has loaded.
    # Then, we click the 'browse' button to open the file explorer.
    def click_import_cohort_browse(self, button_text_name: str):
        self.wait_until_locator_is_visible(CohortBarLocators.IMPORT_COHORT_MODAL)
        # It does not click the 'browse' button without force parameter set to 'True'
        self.click(
            GenericLocators.BUTTON_BY_DISPLAYED_TEXT(button_text_name), force=True
        )
