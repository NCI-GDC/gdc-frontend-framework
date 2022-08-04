from getgauge.python import step

from step_impl.base.webdriver import WebDriver
from step_impl.apps.gdc_data_portal_v2.nav_analysis_center.app import GDCDataPortalV2App

import time


@step("On GDC Data Portal V2 app")
def navigate_to_app():
    global APP
    WebDriver.page = WebDriver.instance.new_page()
    APP = GDCDataPortalV2App(WebDriver.page)
    APP.home_page.visit()

@step("Analysis Center Icon")
def analysis_center_icon():
    APP.home_page.click_analysis_center_icon()
    time.sleep(5)

