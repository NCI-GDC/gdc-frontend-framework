from typing import List
from step_impl.base.webdriver import WebDriver
class GenericLocators:
    TEXT_DIV_IDENT = lambda text: f'div:text("{text}")'
    TEXT_IN_PARAGRAPH = lambda text: f'p:has-text("{text}")'
    COHORT_BAR_CASE_COUNT = lambda case_count: f'div[data-tour="cohort_management_bar"] span:has-text("{case_count}")'

    SEARCH_BAR_ARIA_IDENT = lambda aria_label: f'[aria-label="{aria_label}"]'
    QUICK_SEARCH_BAR_IDENT = '//input[@aria-label="Quick Search Input"]'
    QUICK_SEARCH_BAR_RESULT_AREA_SPAN = lambda text: f'span:text("{text}")'

    RADIO_BUTTON_IDENT = lambda radio_name: f'//input[@id="{radio_name}"]'
    CHECKBOX_IDENT = lambda checkbox_id: f'//input[@data-testid="checkbox-{checkbox_id}"]'

    DATA_TEST_ID_IDENT = lambda id: f'[data-testid="{id}"]'
    DATA_TESTID_BUTTON_IDENT = lambda data_testid: f'[data-testid="button-{data_testid}"]'

    BUTTON_BY_DISPLAYED_TEXT = lambda button_text_name: f'button:has-text("{button_text_name}")'
    BUTTON_A_BY_TEXT_IDENT = lambda button_text_name: f'a:has-text("{button_text_name}") >> nth=0'

class BasePage:
    def __init__(self, driver) -> None:
        self.driver = driver

    def goto(self, url):
        self.driver.goto(url)

    # Force: Whether to bypass the actionability checks
    def click(self, locator, force=False):
        self.wait_until_locator_is_visible(locator)
        self.driver.locator(locator).click(force=force)

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
        return button_name.lower().replace(" ", "-")

    def normalize_applied_filter_name(self, filter_name: str) -> List[str]:
        periods = [char for char in filter_name if char == "."]
        filter_name = filter_name.replace("_", " ").replace(".", " ")
        filter_name = filter_name.split(" ")
        if len(periods) > 1:
            filter_name = filter_name[2:]
        filter_name = " ".join(word[0].upper() + word[1:] for word in filter_name)
        return filter_name

    # wait for element to have non-empty bounding box and no visibility:hidden
    def wait_until_locator_is_visible(self, locator):
        self.driver.locator(locator).wait_for(state='visible', timeout= 60000)

    # wait for element to not be present in DOM
    def wait_until_locator_is_detached(self, locator):
        self.driver.locator(locator).wait_for(state='detached', timeout= 60000)

    # wait for element to be either detached from DOM, or have an empty bounding box or visibility:hidden
    def wait_until_locator_is_hidden(self, locator):
        self.driver.locator(locator).wait_for(state='hidden', timeout= 15000)

    def is_text_present(self, text):
        locator = GenericLocators.TEXT_DIV_IDENT(text)
        try:
            self.wait_until_locator_is_visible(locator)
        except:
            return False
        return True

    def is_text_not_present(self, text):
        locator = GenericLocators.TEXT_DIV_IDENT(text)
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

    def click_button_data_testid(self, data_testid):
        locator = GenericLocators.DATA_TESTID_BUTTON_IDENT(data_testid)
        self.click(locator)

    def click_button_with_displayed_text_name(self, button_text_name):
        locator = GenericLocators.BUTTON_BY_DISPLAYED_TEXT(button_text_name)
        self.click(locator)

    def click_button_ident_a_with_displayed_text_name(self, button_text_name):
        locator = GenericLocators.BUTTON_A_BY_TEXT_IDENT(button_text_name)
        self.click(locator)

    def send_text_into_search_bar(self, text_to_send, aria_label):
        locator = GenericLocators.SEARCH_BAR_ARIA_IDENT(aria_label)
        self.wait_until_locator_is_visible(locator)
        self.send_keys(locator, text_to_send)

    def wait_for_selector(self, locator):
        self.driver.wait_for_selector(locator)

    # Clicks a radio button in a filter card
    def click_radio_button(self, radio_name):
        locator = GenericLocators.RADIO_BUTTON_IDENT(radio_name)
        self.click(locator)

    # Returns if a filter card enum checkbox is checked
    def is_facet_card_enum_checkbox_checked(self, checkbox_id):
        locator = GenericLocators.CHECKBOX_IDENT(checkbox_id)
        result = self.is_checked(locator)
        return result

    def quick_search_and_click(self,text):
        self.send_keys(GenericLocators.QUICK_SEARCH_BAR_IDENT, text)
        text_locator = GenericLocators.QUICK_SEARCH_BAR_RESULT_AREA_SPAN(text)
        self.click(text_locator)

    def perform_action_handle_new_tab(self, source:str, button:str):
        """
        perform_action_handle_new_tab performs an action to open a new tab,
        and then returns a page object for that new tab.

        :param source: Specifies what function is causing the action to open the new tab
        :param button: ID or Name of the button that is being clicked to open the new tab
        :return: a page object for the new tab that has been opened
        """
        sources = {
            "Home Page": self.click_button_ident_a_with_displayed_text_name
        }
        driver = WebDriver.page
        with driver.context.expect_page() as tab:
           sources.get(source)(button)
        new_tab = tab.value
        return new_tab
