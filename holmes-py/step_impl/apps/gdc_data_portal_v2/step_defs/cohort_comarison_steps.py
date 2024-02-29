from getgauge.python import step, before_spec,data_store

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Collect case count of cohort <cohort_name> for comparison on the cohort comparison selection screen")
def store_cohort_case_count_selection_screen_cohort_comparison(cohort_name:str):
    """
    Stores the case count of the specified cohort on the cohort comparison selection screen.
    """
    cohort_case_count = APP.cohort_comparison_page.get_cohort_case_count_on_selection_screen(cohort_name)
    data_store.spec[f"{cohort_name} Selection Screen"] = cohort_case_count
