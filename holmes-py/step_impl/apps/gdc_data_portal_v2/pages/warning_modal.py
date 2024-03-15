from playwright.sync_api import Page


class WarningModalLocators:
    ACCEPT_BUTTON = 'button[data-testid="button-intro-warning-accept"]'


class WarningModal:
    def __init__(self, driver: Page, url):
        self.URL = "{}".format(url)
        self.driver = driver  # driver is PW page

    def accept_warning(self):
        if self.driver.is_visible(WarningModalLocators.ACCEPT_BUTTON):
            self.driver.locator(WarningModalLocators.ACCEPT_BUTTON).click()
