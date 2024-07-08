from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Name Set <set_name> in Set Creation modal")
def name_set_in_modal(set_name: str):
    """
    This step is used to shorten the number of steps needed for set creation.
    This is used after identifiers have already been given in the set creation modal.
    Pairs with the step 'upload_file' located in generic_steps.py
    """
    APP.shared.click_button_with_displayed_text_name("Submit")
    APP.shared.send_text_into_text_box(set_name, "Name Input Field")
    APP.shared.click_button_with_displayed_text_name("Save")
    APP.manage_sets_page.wait_for_set_text_in_temporary_message("Set has been saved.")

@step("Select Create Set and from the dropdown choose <set_dropdown_option>")
def click_set_type_to_create(set_dropdown_option: str):
    APP.manage_sets_page.click_create_set_and_select_from_dropdown(set_dropdown_option)


@step("Select <button_to_select> for set <set_name> on Manage Sets page")
def select_button_on_set_row_in_manage_sets(button_to_select: str, set_name: str):
    APP.manage_sets_page.click_button_on_set_row_in_manage_sets(
        button_to_select, set_name
    )


@step("Select checkbox for set <set_name> on Manage Sets page")
def select_checkbox_on_set_row_in_manage_sets(set_name: str):
    APP.manage_sets_page.click_checkbox_on_set_row_in_manage_sets(set_name)


@step("Select item list for set <set_name> on Manage Sets page")
def select_item_list_on_set_row_in_manage_sets(set_name: str):
    APP.manage_sets_page.click_item_list_on_set_row_in_manage_sets(set_name)


@step("Close set panel")
def click_close_set_panel():
    APP.manage_sets_page.click_close_set_panel()
