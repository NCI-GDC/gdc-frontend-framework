from typing import List

class GenericLocators:
    DATA_TEST_ID_IDENT = lambda id: f'[data-testid="{id}"]'
    RADIO_BUTTON_IDENT = lambda radio_name: f'//input[@id="{radio_name}"]'
    CHECKBOX_IDENT = lambda checkbox_id: f'//input[@data-testid="checkbox-{checkbox_id}"]'
    BUTTON_GENERIC_IDENT = lambda button_name: f'//button[@data-testid="button-{button_name}"]'
    QUICK_SEARCH_BAR_IDENT = '//input[@aria-label="Quick Search Input"]'
    QUICK_SEARCH_BAR_RESULT_AREA_SPAN = lambda text: f'span:text("{text}")'

class BasePage:
    def __init__(self, driver) -> None:
        self.driver = driver

    def goto(self, url):
        self.driver.goto(url)

    def click(self, locator):
        self.wait_for_selector(locator)
        self.driver.locator(locator).click()

    def get_text(self, locator):
        return self.driver.locator(locator).text_content()

    def get_input_value(self, locator):
        return self.driver.locator(locator).input_value()

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

    def wait_for_selector(self, locator):
        self.driver.wait_for_selector(locator)

    # wait for element to have non-empty bounding box and no visibility:hidden
    def wait_until_locator_is_visible(self, locator):
        self.driver.locator(locator).wait_for(state='visible', timeout= 60000)

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
