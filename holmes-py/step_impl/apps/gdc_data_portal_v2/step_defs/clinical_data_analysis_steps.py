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

@step("Validate the <card_name> analysis card's table contains these values <table>")
def validate_table_value_on_analysis_card_is_present(card_name, table):
    for k, v in enumerate(table):
        is_table_value_on_analysis_card_present = APP.clinical_data_analysis.is_table_value_on_analysis_card_present(card_name, v[0])
        assert is_table_value_on_analysis_card_present, f"On analysis card '{card_name}', the table does not contain the value '{v[0]}'"

@step("Validate the <card_name> analysis card's table do not contain these values <table>")
def validate_table_value_on_analysis_card_is_present(card_name, table):
    for k, v in enumerate(table):
        is_table_value_on_analysis_card_present = APP.clinical_data_analysis.is_table_value_on_analysis_card_present(card_name, v[0])
        assert is_table_value_on_analysis_card_present == False, f"On analysis card '{card_name}', the table does not contain the value '{v[0]}'"

@step("On the <card_name> card, select <button_name> button on the Clinical Data Analysis page")
def click_button_on_analysis_card(card_name:str, button_name:str):
    """Selects a button on an analysis card"""
    APP.clinical_data_analysis.click_button_on_analysis_card(card_name,button_name)

@step("Select <button_name> in a categorical custom bin modal on the Clinical Data Analysis page")
def click_button_categorical_modal(button_name):
    """Selects a button on a custom bin modal on a categorical analysis card"""
    APP.clinical_data_analysis.click_button_categorical_modal(button_name)

@step("Select the following values in a categorical custom bin modal on the Clinical Data Analysis page <table>")
def click_value_categorical_modal(table):
    """In the value section, selects specified values"""
    for k, v in enumerate(table):
       APP.clinical_data_analysis.click_value_categorical_modal(v[0])

@step("Select the following hidden values in a categorical custom bin modal on the Clinical Data Analysis page <table>")
def click_hidden_value_categorical_modal(table):
    """In the hidden value section, selects specified values"""
    for k, v in enumerate(table):
       APP.clinical_data_analysis.click_hidden_value_categorical_modal(v[0])

@step("Name the group of values <custom_group_name> in a categorical custom bin modal on the Clinical Data Analysis page")
def name_group_of_values_categorical_modal(custom_group_name):
    """After clicking the 'group' button, name the custom bin"""
    APP.clinical_data_analysis.name_group_of_values_categorical_modal(custom_group_name)
    APP.shared.keyboard_press("Enter")

@step("Validate <values_or_hidden_values> are <present_or_not_present> in a categorical custom bin modal on the Clinical Data Analysis page <table>")
def validate_value_present_or_not_present_categorical_modal(values_or_hidden_values, present_or_not_present, table):
    """Validate if the items in the specified section are present or not as expected"""
    values_or_hidden_values = values_or_hidden_values.lower()
    present_or_not_present = present_or_not_present.lower()
    for k, v in enumerate(table):
        # First, determine if we are checking the 'value' section or 'hidden value' section
        if values_or_hidden_values == "values":
            is_present = APP.clinical_data_analysis.is_value_present_categorical_modal(v[0])
        if values_or_hidden_values == "hidden values":
            is_present = APP.clinical_data_analysis.is_hidden_value_present_categorical_modal(v[0])

        # Then, we assert if they are present or not present based on spec file input
        if present_or_not_present == "present":
            assert is_present, f"Hidden Value '{v[0]}' is NOT present in list"
        if present_or_not_present == "not present":
            assert not is_present, f"Hidden Value '{v[0]}' is present in list when it should NOT be"

@step("Select bin option <button_name> in a continuous custom bin modal on the Clinical Data Analysis page")
def click_button_bin_option_continuous_modal(button_name):
    """Choose between set interval or custom range option"""
    APP.clinical_data_analysis.click_button_bin_option_continuous_modal(button_name)

@step("<button_name> the continuous custom bin modal on the Clinical Data Analysis page")
def click_save_cancel_button_continuous_modal(button_name):
    """Select save or cancel on the continuous custom bin modal"""
    APP.clinical_data_analysis.click_save_cancel_button_continuous_modal(button_name)

@step("Select <button_name> in a continuous custom bin modal on the Clinical Data Analysis page")
def click_button_continuous_modal(button_name):
    """Select various buttons on the continuous custom bin modal"""
    APP.clinical_data_analysis.click_button_continuous_modal(button_name)

@step("Set interval of <interval_amount> with values from <min_value> to less than <max_value> in a continuous custom bin modal on the Clinical Data Analysis page")
def set_interval_with_min_to_max_continuous_modal(interval_amount, min_value, max_value):
    """In the set interval option, set a custom interval with a min and max"""
    APP.clinical_data_analysis.set_interval_with_min_to_max_continuous_modal(interval_amount, min_value, max_value)

@step("<add_or_edit> a custom range bin in a continuous custom bin modal on the Clinical Data Analysis page <table>")
def add_or_edit_custom_range_continuous_modal(add_or_edit, table):
    """In the custom range option, add named custom bins with a set min and max"""
    add_or_edit = add_or_edit.lower()
    for k, v in enumerate(table):
        """
        v[0]: bin_name
        v[1]: from_value
        v[2]: to_less_than_value
        v[3]: row_number
        """
        APP.clinical_data_analysis.add_or_edit_custom_range_continuous_modal(v[0],v[1],v[2],v[3])
        if add_or_edit == "add":
            APP.clinical_data_analysis.click_add_custom_bin_button_continuous_modal()

@step("Add custom range bin")
def click_add_custom_bin_button_continuous_modal():
    """In the custom range option, after a row has a bin name with min and max, click the 'add' button"""
    APP.clinical_data_analysis.click_add_custom_bin_button_continuous_modal()

@step("Delete custom range bin in row number <row_number>")
def click_delete_custom_bin_button_continuous_modal(row_number):
    """In the custom range option, delete a specified row"""
    APP.clinical_data_analysis.click_delete_custom_bin_button_continuous_modal(row_number)
