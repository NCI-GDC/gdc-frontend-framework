from step_impl.apps.playwright_example.pages.home_page import HomePage


class GDCDataPortalApp:
    def __init__(self, webdriver):  # webdriver is page now.
        self.url = "https://portal.gdc.cancer.gov"
        self.driver = webdriver
        self.init_pages()

    def navigate(self):
        self.driver.goto(self.url)

    def init_pages(self):
        self.home_page = HomePage(self.driver, self.url)
