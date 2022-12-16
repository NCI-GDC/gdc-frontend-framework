import os

from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePage
from step_impl.apps.gdc_data_portal_v2.pages.nav_analysis_center import (
    NavAnalysisCenterPage,
)
from step_impl.apps.gdc_data_portal_v2.pages.clinical_data_analysis import (
    ClinicalDataAnalysisPage,
)
from step_impl.apps.gdc_data_portal_v2.pages.warning_modal import WarningModal
from ..gdc_data_portal_v2.pages.analysis_page import AnalysisPage
from ..gdc_data_portal_v2.pages.repository_page import RepositoryPage


class GDCDataPortalV2App:
    def __init__(self, webdriver):  # webdriver is page now.
        APP_ENDPOINT = f"APP_ENDPOINT{os.getenv('APP_ENVIRONMENT','')}"
        self.url = f"{os.getenv(APP_ENDPOINT)}/"
        self.driver = webdriver
        self.init_pages()
        self.navigate()
        self.warning_modal.accept_warning()

    def navigate(self):
        self.driver.goto(self.url)

    def init_pages(self):
        self.warning_modal = WarningModal(self.driver, self.url)
        self.home_page = HomePage(self.driver, self.url)
        self.analysis_page = AnalysisPage(self.driver, self.url)
        self.repository_page = RepositoryPage(self.driver, self.url)
        self.nav_analysis_center = NavAnalysisCenterPage(self.driver, self.url)
        self.clinical_data_analysis = ClinicalDataAnalysisPage(self.driver, self.url)
