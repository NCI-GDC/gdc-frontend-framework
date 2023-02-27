from typing import List

class GenericLocators:
    TEXT_DIV_IDENT = lambda text: f'div:text("{text}")'
    DATA_TESTID_BUTTON_IDENT = lambda data_testid: f'[data-testid="button-{data_testid}"]'
    SEARCH_BAR_ARIA_IDENT = lambda aria_label: f'[aria-label="{aria_label}"]'

class BasePage:
    def __init__(self, driver) -> None:
        self.driver = driver

    def goto(self, url):
        self.driver.goto(url)

    def click(self, locator):
        self.wait_until_locator_is_visible(locator)
        self.driver.locator(locator).click()

    def get_text(self, locator):
        return self.driver.locator(locator).text_content()

    def get_input_value(self, locator):
        return self.driver.locator(locator).input_value()

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

    def is_text_present(self, text):
        locator = GenericLocators.TEXT_DIV_IDENT(text)
        is_text_present = self.is_visible(locator)
        return is_text_present

    def is_data_testid_present(self, data_testid):
        locator = GenericLocators.DATA_TESTID_BUTTON_IDENT(data_testid)
        is_data_testid_present = self.is_visible(locator)
        return is_data_testid_present

    def click_button_data_testid(self, data_testid):
        locator = GenericLocators.DATA_TESTID_BUTTON_IDENT(data_testid)
        self.click(locator)

    def send_text_into_search_bar(self, text_to_send, aria_label):
        locator = GenericLocators.SEARCH_BAR_ARIA_IDENT(aria_label)
        self.wait_until_locator_is_visible(locator)
        self.send_keys(locator, text_to_send)
