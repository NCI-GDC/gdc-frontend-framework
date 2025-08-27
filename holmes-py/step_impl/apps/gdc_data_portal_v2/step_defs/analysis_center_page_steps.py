from getgauge.python import step, before_spec, data_store

from step_impl.base.webdriver import WebDriver
from step_impl.apps.gdc_data_portal_v2.app import GDCDataPortalV2App


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Collect these tool card case counts for comparison <table>")
def store_home_page_data_portal_statistics(table):
    """
    Stores tool card case count for use in future tests.
    Pairs with the test 'verify_compared_statistics_are_equal_or_not_equal'

    v[0] - The name of the tool card case count to collect
    """
    for k, v in enumerate(table):
        tool_card_case_count = APP.analysis_center_page.get_analysis_tool_cases_count(v[0])
        data_store.spec[f"{v[0]} Tool Card Case Count"] = tool_card_case_count

@step("Validate Core Tools Navigation")
def navigation_bar_icon_check():
    Result = APP.analysis_center_page.core_tools_navigation_check()
    assert Result, f"FAILED: featured tools did not navigate correctly"


@step("Validate analysis tool description <table>")
def validate_analysis_tool_description(table):
    """For analysis tools, it opens the description and checks if the text matches our spec file"""
    for k, v in enumerate(table):
        APP.analysis_center_page.click_analysis_tool_description(v[0])
        tool_text = APP.analysis_center_page.get_analysis_tool_text(v[0])
        assert (
            tool_text == v[1]
        ), f"The tool description for '{v[0]}' does not match our file"


@step("Validate analysis tool tooltip <table>")
def validate_analysis_tool_description(table):
    """
    When an analysis tool has 0 cases, a tooltip appears on the tool card.
    This hovers over the tooltip and checks if the text matches our spec file
    """
    for k, v in enumerate(table):
        is_tooltip_text_present = (
            APP.analysis_center_page.get_analysis_tool_tooltip_text(v[0], v[1])
        )
        assert (
            is_tooltip_text_present
        ), f"The zero cases tooltip description for '{v[0]}' is not present or does not match our file"
