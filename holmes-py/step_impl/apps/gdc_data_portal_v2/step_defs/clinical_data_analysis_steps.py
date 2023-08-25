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

@step("On the <card_name> card, select <button_name> button on the Clinical Data Analysis page")
def click_button_on_analysis_card(card_name:str, button_name:str):
    APP.clinical_data_analysis.click_button_on_analysis_card(card_name,button_name)

@step("Select <button_name> in a categorical custom bin modal on the Clinical Data Analysis page")
def click_button_categorical_modal(button_name):
    APP.clinical_data_analysis.click_button_categorical_modal(button_name)

@step("Select the following values in a categorical custom bin modal on the Clinical Data Analysis page <table>")
def click_value_categorical_modal(table):
    for k, v in enumerate(table):
       APP.clinical_data_analysis.click_value_categorical_modal(v[0])

@step("Select the following hidden values in a categorical custom bin modal on the Clinical Data Analysis page <table>")
def click_value_categorical_modal(table):
    for k, v in enumerate(table):
       APP.clinical_data_analysis.click_hidden_value_categorical_modal(v[0])

@step("Name the group of values <custom_group_name> in a categorical custom bin modal on the Clinical Data Analysis page")
def name_group_of_values(custom_group_name):
    APP.clinical_data_analysis.name_group_of_values_categorical_modal(custom_group_name)
    APP.shared.keyboard_press("Enter")

@step("Validate values are <present_or_not_present> in a categorical custom bin modal on the Clinical Data Analysis page <table>")
def validate_value_present_or_not_present(present_or_not_present, table):
    present_or_not_present = present_or_not_present.lower()
    if present_or_not_present == "present":
        for k, v in enumerate(table):
            is_present = APP.clinical_data_analysis.is_value_present_categorical_modal(v[0])
            assert is_present, f"Value '{v[0]}' is NOT present in list"
    elif present_or_not_present == "not present":
        for k, v in enumerate(table):
            is_present = APP.clinical_data_analysis.is_value_present_categorical_modal(v[0])
            assert not is_present, f"Value '{v[0]}' is present in list when it should NOT be"
    else:
        print (f"No handle for input - {present_or_not_present}")

@step("Validate hidden values are <present_or_not_present> in a categorical custom bin modal on the Clinical Data Analysis page <table>")
def validate_value_present_or_not_present(present_or_not_present, table):
    present_or_not_present = present_or_not_present.lower()
    if present_or_not_present == "present":
        for k, v in enumerate(table):
            is_present = APP.clinical_data_analysis.is_hidden_value_present_categorical_modal(v[0])
            assert is_present, f"Hidden Value '{v[0]}' is NOT present in list"
    elif present_or_not_present == "not present":
        for k, v in enumerate(table):
            is_present = APP.clinical_data_analysis.is_hidden_value_present_categorical_modal(v[0])
            assert not is_present, f"Hidden Value '{v[0]}' is present in list when it should NOT be"
    else:
        print (f"No handle for input - {present_or_not_present}")
