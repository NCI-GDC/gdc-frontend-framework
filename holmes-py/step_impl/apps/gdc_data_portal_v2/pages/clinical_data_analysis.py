from playwright.sync_api import Page

from ....base.base_page import BasePage


class ClinicalDataAnalysisLocators:
    PLEASE_WAIT_SPINNER = "svg[data-testid='please_wait_spinner']"

    GROUP_TABLE = lambda group: f"div[id=cdave-control-group-{group}]"
    GROUP_TABLE_PLUS_BUTTON = (
        lambda group: f"div[id='cdave-control-group-{group}'] >> button[data-testid='plus-icon']"
    )
    PROPERTY_ROW = lambda property: f"label:text('{property}')"
    FIELD_SELECT_SWITCH_IDENT = (
        lambda field_switch: f'label[for="switch-{field_switch}"] >> nth=1'
    )

    ANALYSIS_CARD = lambda card_name: f"[data-testid='{card_name}-card']"
    BUTTON_ON_ANALYSIS_CARD = (
        lambda card_name, button_name: f"[data-testid='{card_name}-card'] >> [data-testid='button-{button_name}']"
    )
    TEXT_IN_TABLE_ON_ANALYSIS_CARD = (
        lambda card_name, table_value: f"[data-testid='{card_name}-card'] >> [data-testid='table-card'] >> text='{table_value}'"
    )

    BUTTON_CATEGORICAL_MODAL = (
        lambda button_name: f"[data-testid='button-custom-bins-{button_name}']"
    )
    VALUES_CATEGORICAL_MODAL = (
        lambda value: f"[data-testid='cat-bin-modal-values'] >> div:has-text('{value}') >> nth=0"
    )
    HIDDEN_VALUES_CATEGORICAL_MODAL = (
        lambda value: f"[data-testid='cat-bin-modal-hidden-values'] >> div:has-text('{value}') >> nth=0"
    )
    TEXTBOX_NAME_GROUP_CATEGORICAL_MODAL = "[data-testid='textbox-custom-bin-name']"

    BUTTON_CONTINUOUS_MODAL = (
        lambda button_name: f"[data-testid='button-{button_name}']"
    )
    BUTTON_SAVE_CANCEL_CONTINUOUS_MODAL = (
        lambda button_name: f"[data-testid='button-custom-bins-{button_name}']"
    )
    BUTTON_BIN_OPTION_CONTINUOUS_MODAL = (
        lambda button_name: f"[data-testid='button-select-{button_name}']"
    )

    TEXTBOX_SET_INTERVAL_SIZE_CONTINUOUS_MODAL = (
        "[data-testid='textbox-set-interval-size']"
    )
    TEXTBOX_SET_INTERVAL_MIN_CONTINUOUS_MODAL = (
        "[data-testid='textbox-set-interval-min']"
    )
    TEXTBOX_SET_INTERVAL_MAX_CONTINUOUS_MODAL = (
        "[data-testid='textbox-set-interval-max']"
    )

    TEXTBOX_SET_BIN_NAME_CONTINUOUS_MODAL = (
        lambda row_number: f"[data-testid='textbox-range-name'] >> nth={row_number}"
    )
    TEXTBOX_SET_RANGE_FROM_CONTINUOUS_MODAL = (
        lambda row_number: f"[data-testid='textbox-range-from'] >> nth={row_number}"
    )
    TEXTBOX_SET_RANGE_TO_CONTINUOUS_MODAL = (
        lambda row_number: f"[data-testid='textbox-range-to'] >> nth={row_number}"
    )
    BUTTON_ADD_CUSTOM_BIN_CONTINUOUS_MODAL = "[data-testid='button-range-add']"
    BUTTON_DELETE_CUSTOM_BIN_CONTINUOUS_MODAL = (
        lambda row_number: f"[data-testid='button-range-delete'] >> nth={row_number}"
    )


class ClinicalDataAnalysisPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=CDave".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def wait_until_analysis_card_is_visible(self, analysis_card_name):
        analysis_card_locator = ClinicalDataAnalysisLocators.ANALYSIS_CARD(
            analysis_card_name
        )
        try:
            self.wait_until_locator_is_visible(analysis_card_locator)
        except:
            return False
        return True

    def wait_until_analysis_card_is_detached(self, analysis_card_name):
        analysis_card_locator = ClinicalDataAnalysisLocators.ANALYSIS_CARD(
            analysis_card_name
        )
        try:
            self.wait_until_locator_is_detached(analysis_card_locator)
        except:
            return False
        return True

    def click_field_select_switch(self, field_switch):
        """
        On the left panel, clicks a switch on the specified field. It either adds or removes
        the selected analysis card depending on it's state before the click.
        """
        field_switch_locator = ClinicalDataAnalysisLocators.FIELD_SELECT_SWITCH_IDENT(
            field_switch
        )
        self.click(field_switch_locator)

    def expand_clinical_property_sections(self):
        self.click(ClinicalDataAnalysisLocators.GROUP_TABLE_PLUS_BUTTON("Demographic"))
        self.click(ClinicalDataAnalysisLocators.GROUP_TABLE_PLUS_BUTTON("Diagnosis"))
        self.click(ClinicalDataAnalysisLocators.GROUP_TABLE_PLUS_BUTTON("Treatment"))
        self.click(ClinicalDataAnalysisLocators.GROUP_TABLE_PLUS_BUTTON("Exposures"))

    def validate_property_table(self, table):
        # Grab the group value
        for row, value in enumerate(table):
            group = table[0][1]
            break

        # From the group value, select the correct table
        table_locator = ClinicalDataAnalysisLocators.GROUP_TABLE(group)

        # search for the property value in the specified table
        for row, value in enumerate(table):
            property = table[row][0]
            property_locator = (
                table_locator
                + ">>"
                + ClinicalDataAnalysisLocators.PROPERTY_ROW(property)
            )
            try:
                self.driver.wait_for_selector(property_locator, state="visible")
            except:
                # If there is a property value missing, the table is invalid and we return error information
                return f"The table '{group}' is missing the property '{property}'"
        # If we find all values in the table, it passes the test
        return True

    def is_table_value_on_analysis_card_present(self, analysis_card_name, table_value):
        """On the given analysis card, returns if specified value is present on the card's table"""
        text_table_locator = (
            ClinicalDataAnalysisLocators.TEXT_IN_TABLE_ON_ANALYSIS_CARD(
                analysis_card_name, table_value
            )
        )
        return self.is_visible(text_table_locator)

    def click_button_on_analysis_card(self, analysis_card_name, button_name):
        """Clicks a button on the given analysis card"""
        button_name = self.normalize_button_identifier(button_name)
        button_locator = ClinicalDataAnalysisLocators.BUTTON_ON_ANALYSIS_CARD(
            analysis_card_name, button_name
        )
        self.click(button_locator)

    def click_button_categorical_modal(self, button_name):
        """Clicks a button on a categorical value modal"""
        button_name = self.normalize_button_identifier(button_name)
        button_locator = ClinicalDataAnalysisLocators.BUTTON_CATEGORICAL_MODAL(
            button_name
        )
        self.click(button_locator)

    def click_value_categorical_modal(self, value):
        """Clicks a value in the 'value' section on a categorical value modal"""
        value_locator = ClinicalDataAnalysisLocators.VALUES_CATEGORICAL_MODAL(value)
        self.click(value_locator)

    def click_hidden_value_categorical_modal(self, hidden_value):
        """Clicks a value in the 'hidden value' section on a categorical value modal"""
        hidden_value_locator = (
            ClinicalDataAnalysisLocators.HIDDEN_VALUES_CATEGORICAL_MODAL(hidden_value)
        )
        self.click(hidden_value_locator)

    def name_group_of_values_categorical_modal(self, custom_group_name):
        """After values have been grouped together, accesses textbox to name the group"""
        self.send_keys(
            ClinicalDataAnalysisLocators.TEXTBOX_NAME_GROUP_CATEGORICAL_MODAL,
            custom_group_name,
        )

    def is_value_present_categorical_modal(self, value):
        """Is specified value present in the 'value' section"""
        value_locator = ClinicalDataAnalysisLocators.VALUES_CATEGORICAL_MODAL(value)
        return self.is_visible(value_locator)

    def is_hidden_value_present_categorical_modal(self, hidden_value):
        """Is specified value present in the 'hidden value' section"""
        hidden_value_locator = (
            ClinicalDataAnalysisLocators.HIDDEN_VALUES_CATEGORICAL_MODAL(hidden_value)
        )
        return self.is_visible(hidden_value_locator)

    def click_save_cancel_button_continuous_modal(self, button_name):
        """Clicks save or cancel in a continuous value modal"""
        button_name = self.normalize_button_identifier(button_name)
        button_locator = (
            ClinicalDataAnalysisLocators.BUTTON_SAVE_CANCEL_CONTINUOUS_MODAL(
                button_name
            )
        )
        self.click(button_locator)

    def click_button_continuous_modal(self, button_name):
        """Clicks specified button in a continuous value modal"""
        button_name = self.normalize_button_identifier(button_name)
        button_locator = ClinicalDataAnalysisLocators.BUTTON_CONTINUOUS_MODAL(
            button_name
        )
        self.click(button_locator)

    def click_button_bin_option_continuous_modal(self, button_name):
        """Choose between set interval or custom range option"""
        button_name = self.normalize_button_identifier(button_name)
        button_locator = (
            ClinicalDataAnalysisLocators.BUTTON_BIN_OPTION_CONTINUOUS_MODAL(button_name)
        )
        self.click(button_locator)

    def set_interval_with_min_to_max_continuous_modal(
        self, interval_amount, min_value, max_value
    ):
        """In the set interval option, set a custom interval with a min and max"""
        interval_size_locator = (
            ClinicalDataAnalysisLocators.TEXTBOX_SET_INTERVAL_SIZE_CONTINUOUS_MODAL
        )
        interval_min_locator = (
            ClinicalDataAnalysisLocators.TEXTBOX_SET_INTERVAL_MIN_CONTINUOUS_MODAL
        )
        interval_max_locator = (
            ClinicalDataAnalysisLocators.TEXTBOX_SET_INTERVAL_MAX_CONTINUOUS_MODAL
        )
        self.send_keys(interval_size_locator, interval_amount)
        self.send_keys(interval_min_locator, min_value)
        self.send_keys(interval_max_locator, max_value)

    def add_or_edit_custom_range_continuous_modal(
        self, bin_name, from_value, to_less_than_value, row_number
    ):
        """In the custom range option, add/edit named custom bins with specified values from and to"""
        row_number = self.make_input_0_index(row_number)
        bin_name_locator = (
            ClinicalDataAnalysisLocators.TEXTBOX_SET_BIN_NAME_CONTINUOUS_MODAL(
                row_number
            )
        )
        range_from_locator = (
            ClinicalDataAnalysisLocators.TEXTBOX_SET_RANGE_FROM_CONTINUOUS_MODAL(
                row_number
            )
        )
        range_to_locator = (
            ClinicalDataAnalysisLocators.TEXTBOX_SET_RANGE_TO_CONTINUOUS_MODAL(
                row_number
            )
        )
        self.send_keys(bin_name_locator, bin_name)
        self.send_keys(range_from_locator, from_value)
        self.send_keys(range_to_locator, to_less_than_value)

    def click_add_custom_bin_button_continuous_modal(self):
        """In the custom range option, after a row has a bin name with min and max, click the 'add' button"""
        add_custom_bin_button_locator = (
            ClinicalDataAnalysisLocators.BUTTON_ADD_CUSTOM_BIN_CONTINUOUS_MODAL
        )
        self.click(add_custom_bin_button_locator)

    def click_delete_custom_bin_button_continuous_modal(self, row_number):
        """In the custom range option, delete a specified row"""
        row_number = self.make_input_0_index(row_number)
        delete_custom_bin_button_locator = (
            ClinicalDataAnalysisLocators.BUTTON_DELETE_CUSTOM_BIN_CONTINUOUS_MODAL(
                row_number
            )
        )
        self.click(delete_custom_bin_button_locator)
