from getgauge.python import step, before_spec

from step_impl.base.webdriver import WebDriver
from step_impl.apps.gdc_data_portal_v2.app import GDCDataPortalV2App


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Validate featured tools navigation")
def navigation_bar_icon_check():
    Result = APP.analysis_center_page.featured_tools_navigation_check()
    assert Result, f"FAILED: featured tools did not navigate correctly"
