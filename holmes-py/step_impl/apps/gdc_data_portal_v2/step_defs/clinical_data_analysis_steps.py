from getgauge.python import step, before_spec

from step_impl.base.webdriver import WebDriver
from step_impl.apps.gdc_data_portal_v2.app import GDCDataPortalV2App


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Navigate to cDAVE app")
def navigate_to_cdave_app():
    APP.clinical_data_analysis.navigate_to_cdave_app()


@step("Expand clinical property sections")
def expand_clinical_property_sections():
    APP.clinical_data_analysis.expand_clinical_property_sections()


@step("Check clinical properties <table>")
def check_clinical_properties_in_pannel(table):
    is_property_table_valid = APP.clinical_data_analysis.validate_property_table(table)
    assert is_property_table_valid == True, is_property_table_valid

@step("test click")
def test():
    APP.clinical_data_analysis.test_click()
