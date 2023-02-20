from typing import List


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
