import time
from getgauge.python import step, before_spec, data_store

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

@step("Collect case count of cohorts s1 and s2 on the cohort comparison main screen")
def store_cohort_case_count_main_screen_cohort_comparison():
    """
    Stores the case count of the two cohorts shown on the cohort comparison main screen.
    """
    cohort_case_count_s1 = APP.cohort_comparison_page.get_cohort_case_count_on_main_screen("0")
    data_store.spec[f"Cohort Comparison s1"] = cohort_case_count_s1

    cohort_case_count_s2 = APP.cohort_comparison_page.get_cohort_case_count_on_main_screen("1")
    data_store.spec[f"Cohort Comparison s2"] = cohort_case_count_s2


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
        APP.cohort_comparison_page.wait_for_survival_plot_loading_spinner_to_detatch_cohort_comparison()

@step("Select analysis cards to enable or disable on Cohort Comparison <table>")
def click_analysis_card_enable_disable_button(table):
    for k, v in enumerate(table):
        APP.cohort_comparison_page.click_analysis_card_button_enable_disable(v[0])
    try:
        APP.shared.wait_for_loading_spinner_to_be_visible(2000)
        APP.shared.wait_for_loading_spinner_to_detatch()
        APP.cohort_comparison_page.wait_for_survival_plot_loading_spinner_to_detatch_cohort_comparison()
    except:
        APP.shared.wait_for_loading_spinner_to_detatch()
        APP.cohort_comparison_page.wait_for_survival_plot_loading_spinner_to_detatch_cohort_comparison()

@step("Verify analysis cards are visible or not visible as expected on Cohort Comparison <table>")
def is_analysis_card_visible_or_not_visible_as_expected(table):
    for k, v in enumerate(table):
        is_analysis_card_visible = APP.cohort_comparison_page.is_analysis_card_visible_cohort_comparison(v[0])
        should_analysis_card_be_visible_or_not_visible = v[1].lower()
        if should_analysis_card_be_visible_or_not_visible == "visible":
            assert is_analysis_card_visible, f"The analysis card {v[0]} is NOT visible when it should be"
        elif should_analysis_card_be_visible_or_not_visible == "not visible":
            assert is_analysis_card_visible==False, f"The analysis card {v[0]} is visible when it should NOT be"

@step("Collect case counts on save cohort buttons from an analysis card on Cohort Comparison <table>")
def collect_case_counts_on_save_cohort_buttons_from_analysis_card_cohort_comparison(table):
    """
    collect_case_counts_on_save_cohort_buttons_from_analysis_card_cohort_comparison Collect case count on
    specified save filtered cohort buttons from an analysis card on cohort comparison main screen.
    on the cohort comparison main screen.

    :param v[0]: Analysis Card
    :param v[1]: Filter Row Name
    :param v[2]: Cohort Number to select (i.e 1 or 2)
    :param v[3]: Save Case Counts As
    """
    for k, v in enumerate(table):
        case_count = APP.cohort_comparison_page.get_case_count_on_save_cohort_button_on_analysis_card_cohort_comparison(v[0],v[1],v[2])
        data_store.spec[f"{v[3]}"] = case_count

@step("Save cohorts from an analysis card on Cohort Comparison <table>")
def save_cohort_analysis_card_cohort_comparison(table):
    """
    save_cohort_analysis_card_cohort_comparison Save a cohort from an analysis card
    on the cohort comparison main screen.

    :param v[0]: Analysis Card
    :param v[1]: Filter Row Name
    :param v[2]: Cohort Number to select (i.e 1 or 2)
    :param v[3]: Cohort Name
    """
    for k, v in enumerate(table):
        APP.cohort_comparison_page.click_save_cohort_button_on_analysis_card_cohort_comparison(v[0],v[1],v[2])
        APP.shared.send_text_into_text_box(v[3], "Name Input Field")
        APP.shared.click_button_in_modal_with_displayed_text_name("Save")
        APP.cohort_bar.wait_for_text_in_temporary_message("has been saved", "Remove Modal")
        APP.shared.wait_for_loading_spinner_cohort_bar_case_count_to_detatch()
        time.sleep(2)
