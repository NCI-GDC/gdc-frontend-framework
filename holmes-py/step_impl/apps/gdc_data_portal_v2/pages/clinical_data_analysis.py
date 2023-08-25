from playwright.sync_api import Page

from ....base.base_page import BasePage


class ClinicalDataAnalysisLocators:
    PLEASE_WAIT_SPINNER = "svg[data-testid='please_wait_spinner']"

    GROUP_TABLE = lambda group: f"div[id=cdave-control-group-{group}]"
    GROUP_TABLE_PLUS_BUTTON = (
        lambda group: f"div[id='cdave-control-group-{group}'] >> button[data-testid='plus-icon']"
    )
    PROPERTY_ROW = lambda property: f"label:text('{property}')"
    FIELD_SELECT_SWITCH_IDENT = lambda field_switch: f'label[for="switch-{field_switch}"] >> nth=1'

    ANALYSIS_CARD = lambda card_name: f"[data-testid='{card_name}-card']"
    BUTTON_ON_ANALYSIS_CARD = lambda card_name, button_name: f"[data-testid='{card_name}-card'] >> [data-testid='button-{button_name}']"
    TEXT_IN_TABLE_ON_ANALYSIS_CARD = lambda card_name, table_value: f"[data-testid='{card_name}-card'] >> [data-testid='table-card'] >> text='{table_value}'"

    BUTTON_CATEGORICAL_MODAL = lambda button_name: f"[data-testid='button-custom-bins-{button_name}']"
    VALUES_CATEGORICAL_MODAL = lambda value: f"[data-testid='cat-bin-modal-values'] >> div:has-text('{value}') >> nth=0"
    HIDDEN_VALUES_CATEGORICAL_MODAL = lambda value: f"[data-testid='cat-bin-modal-hidden-values'] >> div:has-text('{value}') >> nth=0"
    TEXTBOX_NAME_GROUP_CATEGORICAL_MODAL = "[data-testid='textbox-custom-bin-name']"


class ClinicalDataAnalysisPage(BasePage):
    def __init__(self, driver: Page, url: str) -> None:
        self.URL = "{}/analysis_page?app=CDave".format(url)
        self.driver = driver  # driver is PW page

    def visit(self):
        self.driver.goto(self.URL)

    def wait_until_analysis_card_is_visible(self, analysis_card_name):
        analysis_card_locator = ClinicalDataAnalysisLocators.ANALYSIS_CARD(analysis_card_name)
        try:
            self.wait_until_locator_is_visible(analysis_card_locator)
        except:
            return False
        return True

    def wait_until_analysis_card_is_detached(self, analysis_card_name):
        analysis_card_locator = ClinicalDataAnalysisLocators.ANALYSIS_CARD(analysis_card_name)
        try:
            self.wait_until_locator_is_detached(analysis_card_locator)
        except:
            return False
        return True

    def click_field_select_switch(self, field_switch):
        field_switch_locator = ClinicalDataAnalysisLocators.FIELD_SELECT_SWITCH_IDENT(field_switch)
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

    def is_table_value_on_analysis_card_is_present(self, analysis_card_name, table_value):
        text_table_locator = ClinicalDataAnalysisLocators.TEXT_IN_TABLE_ON_ANALYSIS_CARD(analysis_card_name,table_value)
        return self.is_visible(text_table_locator)

    def click_button_on_analysis_card(self, analysis_card_name, button_name):
        button_name = self.normalize_button_identifier(button_name)
        button_locator = ClinicalDataAnalysisLocators.BUTTON_ON_ANALYSIS_CARD(analysis_card_name, button_name)
        self.click(button_locator)

    def click_button_categorical_modal(self, button_name):
        button_name = self.normalize_button_identifier(button_name)
        button_locator = ClinicalDataAnalysisLocators.BUTTON_CATEGORICAL_MODAL(button_name)
        self.click(button_locator)

    def click_value_categorical_modal(self, value):
        value_locator = ClinicalDataAnalysisLocators.VALUES_CATEGORICAL_MODAL(value)
        self.click(value_locator)

    def click_hidden_value_categorical_modal(self, hidden_value):
        hidden_value_locator = ClinicalDataAnalysisLocators.HIDDEN_VALUES_CATEGORICAL_MODAL(hidden_value)
        self.click(hidden_value_locator)

    def name_group_of_values_categorical_modal(self, custom_group_name):
        self.send_keys(ClinicalDataAnalysisLocators.TEXTBOX_NAME_GROUP_CATEGORICAL_MODAL,custom_group_name)

    def is_value_present_categorical_modal(self, value):
        value_locator = ClinicalDataAnalysisLocators.VALUES_CATEGORICAL_MODAL(value)
        return self.is_visible(value_locator)

    def is_hidden_value_present_categorical_modal(self, hidden_value):
        hidden_value_locator = ClinicalDataAnalysisLocators.HIDDEN_VALUES_CATEGORICAL_MODAL(hidden_value)
        return self.is_visible(hidden_value_locator)
