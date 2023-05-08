from playwright.sync_api import Page


class AnalysisPageLocators:
    BUTTON_GOTO = lambda tool: f"button[aria-label='Navigate to {tool}']"


class AnalysisPage:
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def navigate_to_tool(self, tool_name: str):
        self.driver.locator(AnalysisPageLocators.BUTTON_GOTO(tool_name)).click()
