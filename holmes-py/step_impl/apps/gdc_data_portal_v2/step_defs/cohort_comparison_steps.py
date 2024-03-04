from getgauge.python import step, before_spec,data_store

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Select cohort <cohort_name> for comparison on the cohort comparison selection screen")
def select_cohort_to_compare_with(cohort_name:str):
    """
    Clicks a button to select a cohort to compare with on the cohort comparison selection screen.
    """
    APP.cohort_comparison_page.select_cohort_to_compare_with(cohort_name)

@step("Collect case count of cohort <cohort_name> for comparison on the cohort comparison selection screen")
def store_cohort_case_count_selection_screen_cohort_comparison(cohort_name:str):
    """
    Stores the case count of the specified cohort on the cohort comparison selection screen.
    """
    cohort_case_count = APP.cohort_comparison_page.get_cohort_case_count_on_selection_screen(cohort_name)
    data_store.spec[f"{cohort_name} Selection Screen"] = cohort_case_count

@step("Run analysis on Cohort Comparison")
def click_run_cohort_comparison_selection_screen():
    APP.cohort_comparison_page.click_run_comparison_cohort_comparison_selection_screen()
    # Need to wait for loading spinners to be present, for them to disappear,
    # and wait for a special loading spinner attached to the survival plot to disappear
    try:
        APP.shared.wait_for_loading_spinner_to_be_visible(15000)
        APP.shared.wait_for_loading_spinner_to_detatch()
        APP.cohort_comparison_page.wait_for_survival_plot_loading_spinner_to_detatch_cohort_comparison()
    except:
        APP.shared.wait_for_loading_spinner_to_detatch()

@step("Select analysis cards to enable or disable on cohort comparison <table>")
def click_analysis_card_enable_disable_button(table):
    for k, v in enumerate(table):
        APP.cohort_comparison_page.click_analysis_card_button_enable_disable(v[0])

@step("Verify analysis cards are visible or not visible as expected on cohort comparison <table>")
def is_analysis_card_visible_or_not_visible_as_expected(table):
    for k, v in enumerate(table):
        is_analysis_card_visible = APP.cohort_comparison_page.is_analysis_card_visible_cohort_comparison(v[0])
        should_analysis_card_be_visible_or_not_visible = v[1].lower()
        if should_analysis_card_be_visible_or_not_visible == "visible":
            assert is_analysis_card_visible, f"The analysis card {v[0]} is NOT visible when it should be"
        elif should_analysis_card_be_visible_or_not_visible == "not visible":
            assert is_analysis_card_visible==False, f"The analysis card {v[0]} is visible when it should NOT be"
