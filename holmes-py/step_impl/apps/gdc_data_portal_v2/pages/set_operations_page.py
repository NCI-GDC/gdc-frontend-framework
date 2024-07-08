from playwright.sync_api import Page

from ....base.base_page import BasePage
from ....base.base_page import GenericLocators


class SetOperationsLocators:
    BUTTON_CREATE_SET = '[data-testid="button-create-set"]'



class SetOperationsPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=SetOperations".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)
