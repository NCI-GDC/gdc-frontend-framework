from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePage
from step_impl.apps.gdc_data_portal_v2.pages.nav_analysis_center import NavAnalysisCenterPage


class GDCDataPortalV2App:
    def __init__(self, webdriver):  # webdriver is page now.
        self.url = "http://localhost:3000/user-flow/workbench"
        self.driver = webdriver
        self.init_pages()

    def navigate(self):
        self.driver.goto(self.url)

    def init_pages(self):
        self.home_page = HomePage(self.driver, self.url)
        self.home_page = NavAnalysisCenterPage(self.driver, self.url)
