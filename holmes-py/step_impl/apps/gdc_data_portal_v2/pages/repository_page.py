from playwright.sync_api import Page


class RepositoryPageLocators:
    TITLE = lambda title_name: f'div[data-testid="{title_name}-title"]'
    FILTERS_FACETS = '//div[@data-testid="filters-facets"]/div'


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

    def get_filter_facet_names(self):
        filter_names = []
        matches = self.driver.locator(RepositoryPageLocators.FILTERS_FACETS).count()
        for i in range(matches):
            nth_inner_element = (
                self.driver.locator(RepositoryPageLocators.FILTERS_FACETS)
                .nth(i)
                .all_inner_texts()
            )
            nth_inner_element = nth_inner_element[0].split("\n")[0]
            filter_names.append(nth_inner_element)
        return filter_names
