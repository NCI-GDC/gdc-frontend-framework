from getgauge.python import step

from step_impl.base.webdriver import WebDriver
from step_impl.apps.gdc_data_portal_v2.app import GDCDataPortalV2App


@step("Navigate to clinical data analysis page")
def navigate_to_analysis_center():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)
    APP.nav_analysis_center.visit()


@step("Navigation Bar Icon Checks")
def navigation_bar_icon_check():
    Result = APP.nav_analysis_center.navigation_bar_card_check()
    assert Result, f"FAILED: Navigation bar"


@step("Navigation Home Screen Center Icon Checks")
def navigation_default_view_icon_check():
    Result = APP.nav_analysis_center.navigation_default_view_card_check()
    assert Result, f"FAILED: Navigation from center icons to nav bar"
