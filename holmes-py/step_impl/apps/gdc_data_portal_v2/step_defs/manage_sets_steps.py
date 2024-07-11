from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver
from getgauge.python import data_store

import time

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

@step("Collect these set item counts on Manage Sets page <table>")
def store_set_item_count_for_comparison(table):
    """
    Stores specified set item count for comparison in future tests.
    Pairs with the test 'verify_compared_statistics_are_equal_or_not_equal'

    :param v[0]: The set to collect the count of
    """
    for k, v in enumerate(table):
        set_to_check = v[0]
        set_count = APP.manage_sets_page.get_item_list_count_on_set_row_in_manage_sets(set_to_check)

        # Everything on the manage sets page could load, except for the counts displayed on the item button.
        # So, we check to see if the button displays '--' which means it's still loading.
        # We check for the button to display an actual number for approximately 15 seconds.
        # If no number appears, we return the '--' as is, and the test will fail as intended.
        retry_counter = 0
        while set_count == "--":
            time.sleep(1)
            set_count = APP.manage_sets_page.get_item_list_count_on_set_row_in_manage_sets(set_to_check)
            print(f"Counts {set_to_check}: {set_count}")
            retry_counter = retry_counter+1
            if retry_counter >= 15:
                break
        data_store.spec[f"{v[0]} Count Manage Sets"] = set_count

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
