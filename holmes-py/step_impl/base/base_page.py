from typing import List
from step_impl.base.webdriver import WebDriver
class GenericLocators:
    TEXT_IDENT = lambda text: f'text="{text}" >> nth=0'
    TEXT_IN_PARAGRAPH = lambda text: f'p:has-text("{text}")'
    X_BUTTON_IN_TEMP_MESSAGE = '>> .. >> .. >> .. >> svg[xmlns="http://www.w3.org/2000/svg"]'
    UNDO_BUTTON_IN_TEMP_MESSAGE = 'span:text("Undo")'
    SET_AS_CURRENT_COHORT_IN_TEMP_MESSAGE = 'span:text("Set this as your current cohort.")'

    LOADING_SPINNER = '[data-testid="loading-spinner"] >> nth=0'

    COHORT_BAR_CASE_COUNT = lambda case_count: f'[aria-label="expand or collapse container"] >> text="{case_count}"'
    CART_IDENT = '[data-testid="cartLink"]'

    CREATE_OR_SAVE_COHORT_MODAL_BUTTON = '[data-testid="action-button"]'

    SEARCH_BAR_ARIA_IDENT = lambda aria_label: f'[aria-label="{aria_label}"]'
    QUICK_SEARCH_BAR_IDENT = '//input[@aria-label="Quick Search Input"]'
    QUICK_SEARCH_BAR_RESULT_AREA_SPAN = lambda text: f'span:text("{text}")'

    RADIO_BUTTON_IDENT = lambda radio_name: f'//input[@id="{radio_name}"]'
    CHECKBOX_IDENT = lambda checkbox_id: f'//input[@data-testid="checkbox-{checkbox_id}"]'

    DATA_TEST_ID_IDENT = lambda id: f'[data-testid="{id}"]'
    DATA_TESTID_BUTTON_IDENT = lambda data_testid: f'[data-testid="button-{data_testid}"]'

    BUTTON_BY_DISPLAYED_TEXT = lambda button_text_name: f'button:has-text("{button_text_name}")'
    BUTTON_A_BY_TEXT_IDENT = lambda button_text_name: f'a:has-text("{button_text_name}") >> nth=0'

    TABLE_AREA_TO_SELECT = lambda row, column: f'tr:nth-child({row}) > td:nth-child({column}) >> nth=0'
    TEXT_TABLE_HEADER = lambda column: f'tr > th:nth-child({column}) >> nth=0'

    BUTTON_COLUMN_SELECTOR = '[data-testid="button-column-selector-box"]'
    SWITCH_COLUMN_SELECTOR = lambda switch_name: f'[data-testid="column-selector-popover-modal"] >> [data-testid="column-selector-row-{switch_name}"] >> [data-testid="button-bottom-switchSpring"]'

    FILTER_GROUP_IDENT = lambda group_name: f'//div[@data-testid="filters-facets"]>> text="{group_name}"'
    FILTER_GROUP_SELECTION_IDENT = lambda group_name, selection: f'//div[@data-testid="filters-facets"]/div[contains(.,"{group_name}")]/..//input[@data-testid="checkbox-{selection}"]'
    FILTER_GROUP_SELECTION_COUNT_IDENT = lambda group_name, selection: f'//div[@data-testid="filters-facets"]/div[contains(.,"{group_name}")]/..//div[@data-testid="text-{selection}"]'
    FILTER_GROUP_ACTION_IDENT = lambda group_name, action: f'//div[@data-testid="filters-facets"]/div[contains(.,"{group_name}")]/.//button[@aria-label="{action}"]'
    FILTER_GROUP_SHOW_MORE_LESS_IDENT = lambda group_name, more_or_less: f'//div[@data-testid="filters-facets"]/div[contains(.,"{group_name}")]/.//button[@data-testid="{more_or_less}"]'

    SHOWING_NUMBER_OF_ITEMS = "[data-testid='text-showing-count']"

class BasePage:
    def __init__(self, driver) -> None:
        self.driver = driver

    def goto(self, url):
        self.driver.goto(url)

    # Force: Whether to bypass the actionability checks
    def click(self, locator, force=False):
        self.wait_until_locator_is_visible(locator)
        self.driver.locator(locator).click(force=force)

    def hover(self, locator):
        """Hover over given locator"""
        self.driver.locator(locator).hover()

    def get_text(self, locator):
        return self.driver.locator(locator).text_content()

    def get_input_value(self, locator):
        return self.driver.locator(locator).input_value()

    def get_attribute(self, locator, name: str):
        return self.driver.locator(locator).get_attribute(name)

    def is_checked(self, locator):
        return self.driver.locator(locator).is_checked()

    def is_visible(self, locator):
        return self.driver.locator(locator).is_visible()

    def send_keys(self, locator, text):
        return self.driver.locator(locator).fill(text)

    def normalize_button_identifier(self, button_name: str) -> str:
        """Takes BDD spec file input and converts it to the ID formatting in the data portal"""
        return button_name.lower().replace(" ", "-")

    def normalize_applied_filter_name(self, filter_name: str) -> List[str]:
        periods = [char for char in filter_name if char == "."]
        filter_name = filter_name.replace("_", " ").replace(".", " ")
        filter_name = filter_name.split(" ")
        if len(periods) > 1:
            filter_name = filter_name[2:]
        filter_name = " ".join(word[0].upper() + word[1:] for word in filter_name)
        return filter_name

    def get_showing_count_text(self):
        """Returns the text of how many items are being shown on the page"""
        locator = GenericLocators.SHOWING_NUMBER_OF_ITEMS
        return self.get_text(locator)

    def get_filter_selection_count(self,filter_group_name,selection):
        """Returns the count of how many items are associated with that filter in the current cohort"""
        locator = GenericLocators.FILTER_GROUP_SELECTION_COUNT_IDENT(filter_group_name, selection)
        return self.get_text(locator)

    def get_table_header_text_by_column(self,column):
        """
        Gets text of table header by column.
        Column indexing begins at '1'
        """
        table_header_text_locator = GenericLocators.TEXT_TABLE_HEADER(column)
        return self.get_text(table_header_text_locator)

    def get_table_body_text_by_row_column(self,row,column):
        """
        Gets text from table body by giving a row and column.
        Row and Column indexing begins at '1'
        """
        table_locator_to_select = GenericLocators.TABLE_AREA_TO_SELECT(row,column)
        return self.get_text(table_locator_to_select)

    def hover_table_body_by_row_column(self,row,column):
        """
        Hovers over specified cell in table by giving a row and column.
        Row and Column indexing begins at '1'
        """
        table_locator_to_select = GenericLocators.TABLE_AREA_TO_SELECT(row,column)
        self.hover(table_locator_to_select)
        self.hover(table_locator_to_select)

    def wait_until_locator_is_visible(self, locator):
        """wait for element to have non-empty bounding box and no visibility:hidden"""
        self.driver.locator(locator).wait_for(state='visible', timeout= 60000)

    def wait_until_locator_is_detached(self, locator):
        """wait for element to not be present in DOM"""
        self.driver.locator(locator).wait_for(state='detached', timeout= 60000)

    def wait_until_locator_is_hidden(self, locator):
        """wait for element to be either detached from DOM, or have an empty bounding box or visibility:hidden"""
        self.driver.locator(locator).wait_for(state='hidden', timeout= 15000)

    def wait_for_text_in_temporary_message(self, text, action="remove modal"):
        """
        Waits for a piece of text to appear in the temporary cohort modal.
        That modal appears after an action has been performed on a cohort
        state (e.g create, save, delete, etc).
        """
        text_locator = GenericLocators.TEXT_IN_PARAGRAPH(text)
        try:
            self.wait_until_locator_is_visible(text_locator)
            if action.lower() == "remove modal":
                # Remove the message after locating it.
                # Automation moves fast, and the messages can pile up. That can cause problems for subsequent scenarios
                x_button_locator = text_locator + GenericLocators.X_BUTTON_IN_TEMP_MESSAGE
                self.click(x_button_locator)
        except:
            return False
        return True

    def wait_for_selector(self, locator):
        self.driver.wait_for_selector(locator)

    def wait_for_loading_spinner_to_be_visible(self):
        locator = GenericLocators.LOADING_SPINNER
        self.wait_until_locator_is_visible(locator)

    def wait_for_loading_spinner_to_detatch(self):
        locator = GenericLocators.LOADING_SPINNER
        self.wait_until_locator_is_detached(locator)

    def wait_for_data_testid_to_be_visible(self,locator):
        """Normalizes a data-testid and waits for it to be visible"""
        normalized_locator = self.normalize_button_identifier(locator)
        locator = GenericLocators.DATA_TEST_ID_IDENT(normalized_locator)
        try:
            self.wait_until_locator_is_visible(locator)
        except:
            return False
        return True

    def is_text_present(self, text):
        locator = GenericLocators.TEXT_IDENT(text)
        try:
            self.wait_until_locator_is_visible(locator)
        except:
            return False
        return True

    def is_text_not_present(self, text):
        locator = GenericLocators.TEXT_IDENT(text)
        try:
            self.wait_until_locator_is_hidden(locator)
        except:
            return False
        return True

    def is_cohort_bar_case_count_present(self, case_count):
        locator = GenericLocators.COHORT_BAR_CASE_COUNT(case_count)
        try:
            self.wait_until_locator_is_visible(locator)
        except:
            return False
        return True

    def is_data_testid_present(self, data_testid):
        locator = GenericLocators.DATA_TESTID_BUTTON_IDENT(data_testid)
        is_data_testid_present = self.is_visible(locator)
        return is_data_testid_present

    def is_facet_card_enum_checkbox_checked(self, checkbox_id):
        """Returns if a filter card enum checkbox is checked"""
        locator = GenericLocators.CHECKBOX_IDENT(checkbox_id)
        result = self.is_checked(locator)
        return result

    def is_cart_count_correct(self, correct_file_count):
        """Returns if cart count is correct"""
        locator = GenericLocators.CART_IDENT
        cart_text = self.get_text(locator)
        cart_count = cart_text.replace('Cart','')
        return cart_count == correct_file_count

    # Checks to see if specified filter card is present
    def is_filter_card_present(self, filter_group_name):
        locator = GenericLocators.FILTER_GROUP_IDENT(filter_group_name)
        try:
            self.wait_until_locator_is_visible(locator)
        except:
            return False
        return True

    def click_data_testid(self, data_testid):
        locator = GenericLocators.DATA_TEST_ID_IDENT(data_testid)
        self.click(locator)

    def click_button_data_testid(self, data_testid):
        locator = GenericLocators.DATA_TESTID_BUTTON_IDENT(data_testid)
        self.click(locator)

    def click_button_with_displayed_text_name(self, button_text_name):
        """Clicks a button based on its displayed text"""
        locator = GenericLocators.BUTTON_BY_DISPLAYED_TEXT(button_text_name)
        self.click(locator)

    def click_button_ident_a_with_displayed_text_name(self, button_text_name):
        """Clicks a button based on its displayed text with a CSS tag of 'a'"""
        locator = GenericLocators.BUTTON_A_BY_TEXT_IDENT(button_text_name)
        self.click(locator)

    def click_radio_button(self, radio_name):
        """Clicks a radio button in a filter card"""
        locator = GenericLocators.RADIO_BUTTON_IDENT(radio_name)
        self.click(locator)

    def click_undo_in_message(self):
        """Clicks 'undo' in a modal message"""
        locator = GenericLocators.UNDO_BUTTON_IN_TEMP_MESSAGE
        self.click(locator)

    def click_set_as_current_cohort_in_message(self):
        """Clicks 'Set this as your current cohort' in a modal message"""
        locator = GenericLocators.SET_AS_CURRENT_COHORT_IN_TEMP_MESSAGE
        self.click(locator)

    def click_create_or_save_button_in_cohort_modal(self):
        """Clicks 'Create' or 'Save' in cohort modal"""
        locator = GenericLocators.CREATE_OR_SAVE_COHORT_MODAL_BUTTON
        self.click(locator)

    def click_column_selector_button(self):
        """Clicks table column selector button"""
        locator = GenericLocators.BUTTON_COLUMN_SELECTOR
        self.click(locator)

    def click_switch_for_column_selector(self, switch_name):
        """In the column selector pop-up modal, clicks specified switch"""
        locator = GenericLocators.SWITCH_COLUMN_SELECTOR(switch_name)
        self.click(locator)

    def make_selection_within_filter_group(self, filter_group_name, selection):
        """Clicks a checkbox within a filter group"""
        locator = GenericLocators.FILTER_GROUP_SELECTION_IDENT(filter_group_name, selection)
        self.click(locator)

    def perform_action_within_filter_card(self, filter_group_name, action):
        """Performs an action in a filter group e.g sorting, resetting, flipping the chart, etc."""
        locator = GenericLocators.FILTER_GROUP_ACTION_IDENT(filter_group_name, action)
        self.click(locator)

    def click_show_more_less_within_filter_card(self, filter_group_name, label):
        """Clicks the show more or show less object"""
        locator = GenericLocators.FILTER_GROUP_SHOW_MORE_LESS_IDENT(filter_group_name, label)
        self.click(locator)

    def select_table_by_row_column(self,row,column):
        """
        Selects values from tables by giving a row and column
        Row and Column indexing begins at '1'
        """
        table_locator_to_select = GenericLocators.TABLE_AREA_TO_SELECT(row,column)
        self.click(table_locator_to_select)

    def send_text_into_search_bar(self, text_to_send, aria_label):
        """Sends text into search bar based on its aria_label"""
        locator = GenericLocators.SEARCH_BAR_ARIA_IDENT(aria_label)
        self.wait_until_locator_is_visible(locator)
        self.send_keys(locator, text_to_send)

    def quick_search_and_click(self,text):
        """
        Sends text into the quick search bar in the upper-right corner of the data portal.
        Then clicks the result in the search result area. Best used with a UUID.
        """
        self.send_keys(GenericLocators.QUICK_SEARCH_BAR_IDENT, text)
        text_locator = GenericLocators.QUICK_SEARCH_BAR_RESULT_AREA_SPAN(text)
        self.click(text_locator)

    # This section of functions is for handling new tabs
    def perform_action_handle_new_tab(self, source:str, button:str):
        """
        perform_action_handle_new_tab performs an action to open a new tab,
        and then returns a page object for that new tab.

        :param source: Specifies what function is causing the action to open the new tab
        :param button: ID or Name of the button that is being clicked to open the new tab
        :return: a page object for the new tab that has been opened
        """
        sources = {
            "Home Page": self.click_button_ident_a_with_displayed_text_name,
            "Footer": self.click_button_ident_a_with_displayed_text_name
        }
        driver = WebDriver.page
        with driver.context.expect_page() as tab:
           sources.get(source)(button)
        new_tab = tab.value
        return new_tab

    def is_text_visible_on_new_tab(self, new_tab, text_to_check):
        """
        is_text_visible_on_new_tab checks for text on a given tab page.

        :param new_tab: The tab page to be checked.
        :param text_to_check: The <p> text to be searched for.
        """
        expected_text_locator = GenericLocators.TEXT_IN_PARAGRAPH(text_to_check)
        try:
            new_tab.locator(expected_text_locator).wait_for(state='visible')
        except:
            return False
        return True
