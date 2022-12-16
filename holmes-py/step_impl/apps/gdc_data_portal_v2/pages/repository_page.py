from playwright.sync_api import Page


class RepositoryPageLocators:
    TITLE = lambda title_name: f'div[data-testid="{title_name}-title"]'


class RepositoryPage:
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=Downloads".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def get_title(self, title_name):
        return self.driver.locator(
            RepositoryPageLocators.TITLE(title_name.lower())
        ).text_content()
