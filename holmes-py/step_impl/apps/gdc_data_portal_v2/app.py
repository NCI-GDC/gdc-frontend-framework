import os

from step_impl.base.base_page import BasePage as Shared
from ..gdc_data_portal_v2.pages.header_section import HeaderSection
from step_impl.apps.gdc_data_portal_v2.pages.home_page import HomePage
from step_impl.apps.gdc_data_portal_v2.pages.analysis_center_page import AnalysisCenterPage
from step_impl.apps.gdc_data_portal_v2.pages.clinical_data_analysis import ClinicalDataAnalysisPage
from step_impl.apps.gdc_data_portal_v2.pages.warning_modal import WarningModal
from ..gdc_data_portal_v2.pages.repository_page import RepositoryPage
from ..gdc_data_portal_v2.pages.cohort_builder_page import CohortBuilderPage
from ..gdc_data_portal_v2.pages.file_summary_page import FileSummaryPage
from ..gdc_data_portal_v2.pages.case_summary_page import CaseSummaryPage
from ..gdc_data_portal_v2.pages.cohort_bar import CohortBar
from ..gdc_data_portal_v2.pages.projects_page import ProjectsPage
from ..gdc_data_portal_v2.pages.mutation_frequency_page import MutationFrequencyPage


class GDCDataPortalV2App:
    def __init__(self, webdriver):  # webdriver is page now.
        app_endpoint_var = "APP_ENDPOINT_PROD" if not os.getenv(
            'APP_ENVIRONMENT') else f"APP_ENDPOINT_{os.environ['APP_ENVIRONMENT']}"
        self.url = f"{os.getenv(app_endpoint_var)}/"
        self.driver = webdriver
        self.init_pages()

    def navigate(self):
        self.driver.goto(self.url)

    def init_pages(self):
        # 'Shared' contains common functions and locators seen throughout the Data Portal.
        # It uses the code contained in base_page.py
        self.shared = Shared(self.driver)
        self.header_section = HeaderSection(self.driver, self.url)
        self.warning_modal = WarningModal(self.driver, self.url)
        self.home_page = HomePage(self.driver, self.url)
        self.repository_page = RepositoryPage(self.driver, self.url)
        self.cohort_builder_page = CohortBuilderPage(self.driver, self.url)
        self.analysis_center_page = AnalysisCenterPage(self.driver, self.url)
        self.clinical_data_analysis = ClinicalDataAnalysisPage(self.driver, self.url)
        self.file_summary_page = FileSummaryPage(self.driver, self.url)
        self.case_summary_page = CaseSummaryPage(self.driver, self.url)
        self.cohort_bar = CohortBar(self.driver, self.url)
        self.projects_page = ProjectsPage(self.driver, self.url)
        self.mutation_frequency_page = MutationFrequencyPage(self.driver, self.url)
