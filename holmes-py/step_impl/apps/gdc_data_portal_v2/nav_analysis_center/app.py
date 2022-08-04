from step_impl.apps.gdc_data_portal_v2.nav_analysis_center.pages.home_page import HomePage


class GDCDataPortalV2App:
    def __init__(self, webdriver):  # webdriver is page now.
        self.url = "http://localhost:3000/user-flow/workbench"
        self.driver = webdriver
        self.init_pages()

    def navigate(self):
        self.driver.goto(self.url)

    def init_pages(self):
        self.home_page = HomePage(self.driver, self.url)
