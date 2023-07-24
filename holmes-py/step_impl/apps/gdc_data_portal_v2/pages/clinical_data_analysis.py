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
