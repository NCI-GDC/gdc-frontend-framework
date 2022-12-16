from getgauge.python import step

from step_impl.base.webdriver import WebDriver
from step_impl.apps.gdc_data_portal_v2.app import GDCDataPortalV2App


@step("Clinical Data Analysis - On GDC Data Portal V2 app")
def navigate_to_app():
    global APP
    WebDriver.page = WebDriver.instance.new_page()
    APP = GDCDataPortalV2App(WebDriver.page)
    APP.clinical_data_analysis.visit()


@step("Navigate to clinical data analysis page")
def navigate_to_cdave_page():
    APP.clinical_data_analysis.navigate_to_cdave_page()


@step("Expand clinical property sections")
def expand_clinical_property_sections():
    APP.clinical_data_analysis.expand_clinical_property_sections()


@step("Check clinical properties <table>")
def check_clinical_properties_in_pannel(table):
    is_property_table_valid = APP.clinical_data_analysis.validate_property_table(table)
    assert is_property_table_valid == True, is_property_table_valid
