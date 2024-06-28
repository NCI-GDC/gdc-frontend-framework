from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)


@step("These links should take the user to correct page in the same tab <table>")
def click_nav_button_same_tab(table):
    for k, v in enumerate(table):
        APP.shared.click_button_ident_a_with_displayed_text_name(v[0])
        APP.header_section.wait_for_page_to_load(v[1])
        APP.home_page.visit()


@step("Live statistics should display correct values <table>")
def validate_live_statistics_display(table):
    for k, v in enumerate(table):
        is_stat_present = APP.home_page.is_live_category_statistic_present(v[1])
        assert (
            is_stat_present
        ), f"For category '{v[0]}', the expected statistic {v[1]} is NOT present"


@step("Select the <label_or_bar_graph> <primary_site> on the Body Plot Graph")
def click_primary_site_on_body_plot_graph(label_or_bar_graph: str, primary_site: str):
    APP.home_page.click_primary_site_on_body_plot_graph(
        label_or_bar_graph, primary_site
    )
