from getgauge.python import step

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@step("Verify that the following default filters are displayed in order <table>")
def default_filters(table):
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)
    repository = APP.repository_page
    actual_filters_order = repository.get_filter_facet_names()
    expected_default_filters_in_order = []
    for row, value in enumerate(table):
        expected_default_filters_in_order.append(table[row][0])
    assert (
        len(actual_filters_order) == len(expected_default_filters_in_order)
        and actual_filters_order == expected_default_filters_in_order
    ), (
        f"Default filters sizes do not match with expected or they are"
        f" not displayed in order.\nActual: {actual_filters_order}"
        f"\nExpected: {expected_default_filters_in_order}"
    )
