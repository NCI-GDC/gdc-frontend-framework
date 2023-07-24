from getgauge.python import step, before_spec

from step_impl.base.webdriver import WebDriver
from step_impl.apps.gdc_data_portal_v2.app import GDCDataPortalV2App


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Select the following fields on the Clinical Data Analysis page <table>")
def click_field_select_switch(table):
    for k, v in enumerate(table):
       APP.clinical_data_analysis.click_field_select_switch(v[0])

@step("Expand clinical property sections")
def expand_clinical_property_sections():
    APP.clinical_data_analysis.expand_clinical_property_sections()

@step("Check clinical properties <table>")
def check_clinical_properties_in_pannel(table):
    is_property_table_valid = APP.clinical_data_analysis.validate_property_table(table)
    assert is_property_table_valid == True, is_property_table_valid

@step("Validate all expected analysis cards are present on the Clinical Data Analysis page <table>")
def validate_default_analysis_cards_are_present(table):
    for k, v in enumerate(table):
        is_analysis_card_present = APP.clinical_data_analysis.wait_until_analysis_card_is_visible(v[0])
        assert is_analysis_card_present, f"The analysis card '{v[0]}' is NOT present"

@step("Validate these analysis cards are not present on the Clinical Data Analysis page <table>")
def validate_default_analysis_cards_are_present(table):
    for k, v in enumerate(table):
        is_analysis_card_not_present = APP.clinical_data_analysis.wait_until_analysis_card_is_detached(v[0])
        assert is_analysis_card_not_present, f"The analysis card '{v[0]}' is present when it should NOT be"
