import json
import time
from datetime import datetime as dt

from getgauge.python import step, before_spec, after_spec, data_store

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver
from ....base.utility import Utility



@step("Pause <sleep_time> seconds")
def pause_10_seconds(sleep_time):
    time.sleep(int(sleep_time))


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)


@step("On GDC Data Portal V2 app")
def navigate_to_app():
    APP.navigate()
    APP.warning_modal.accept_warning()


@step("Go to <page_name> page")
def go_to_page(page_name):
    pages = {"Analysis": APP.analysis_page.visit()}
    pages[page_name]


@step("Navigate to <target> from <source> <target_type>")  # will have click actions
def navigate_to_page_in_page(target, source, target_type):
    sources = {
        "Header": {
            "section": APP.header_section.navigate_to_main_pages
        },
        "Home Page":{
            "app": APP.home_page.navigate_to_app
        },
        "Repository": {
            "app": APP.repository_page.click_button,
        },
        "Analysis": {"app": APP.analysis_page.navigate_to_tool},
        "Cohort Builder": {
            "app": APP.cohort_builder_page.click_button
        }
    }
    sources.get(source)[target_type](target)


@step("Verify that the <text> text is displayed on <source> <target_type>")
def verify_text_on_page(text, source, target_type):
    sources = {
        "Repository": {"app": APP.repository_page.get_title},
        "Add a File Filter": {"modal": APP.repository_page.get_text_on_modal},
    }
    first_text = text.split(" ")[0]
    try:
        text_value = sources.get(source)[target_type](text)
    except:
        text_value = sources.get(source)[target_type](first_text)
    assert (
        text == text_value
    ), f"Unexpected title detected: looking for {text}, but got {text_value}"


@step("Close <modal_name> modal")
def close_modal(modal_name: str):
    modals = {"Add a File Filter": APP.repository_page.close_add_a_file_filter_modal}
    modals.get(modal_name)()
    assert (
        not APP.repository_page.get_file_filter_list_count()
    ), f"Modal is still open.\nModal name: {modal_name}"


@step("Download <file> from <source>")
def download_file_at_file_table(file:str, source:str):
    sources = {
        "Repository": APP.repository_page.click_button
    }
    driver = WebDriver.page
    with driver.expect_download() as download_info:
        sources.get(source)(file)
    download = download_info.value
    file_path = f"{Utility.parent_dir()}/holmes-py/downloads/{dt.timestamp(dt.now())}_{download.suggested_filename}"
    download.save_as(file_path)
    data_store.spec[f"{file} from {source}"] = file_path

@step("Read from <file_type>")
def read_from_file(file_type):
    with open(data_store.spec[file_type],'r+') as f:
        data_store.spec[f"{file_type} contents"] = f.read()

@step("Verify that the <file_type> has <field_name> for each object")
def verify_file_has_expected_field_names(file_type, field_name):
    fails = {}
    if "JSON" in file_type:
        if "annotations.annotation_id" in field_name: return
        json_arr = json.loads(data_store.spec[f"{file_type} contents"])
        field_names = field_name.split(".")
        for json_obj in json_arr:
            if len(field_names) > 1:
                Utility.validate_json_key_exists(Utility.flatten_json(json_obj),field_name, fails)
            elif "platform" in field_name:
                if not json_obj["data_format"] == "VCF" \
                    and not json_obj["data_format"] == "MAF" \
                    and not json_obj["data_format"] == "TSV":
                    Utility.validate_json_key_exists(json_obj, field_name, fails)
            elif "experimental_strategy" in field_name:
                if not json_obj["data_category"] == "Clinical" \
                    and not json_obj["data_category"] == "Biospecimen":
                    Utility.validate_json_key_exists(json_obj, field_name, fails)
            else:
                Utility.validate_json_key_exists(json_obj, field_name, fails)
    elif "TSV" in file_type:
        pass
    assert not fails, f"{file_type} validation failed!\nFails: {fails}"

# TO-DO: replace home_page function call with base_page.
# All generic_step functions and related locators should
# be put into base_page.py
@step("Is text <expected_text> present on the page")
def is_text_present_on_the_page(expected_text: str):
    is_text_present = APP.home_page.is_text_present(expected_text)
    assert is_text_present, f"The text '{expected_text}' is NOT present"

@step("Is data-testid button <data_testid> not present on the page")
def is_data_testid_not_present_on_the_page(data_testid: str):
    is_data_testid_present = APP.home_page.is_data_testid_present(data_testid)
    assert is_data_testid_present == False, f"The data-testid '{data_testid}' IS present"

@step("Select <data_testid> a data-testid button")
def click_button_with_data_testid(data_testid: str):
    APP.home_page.click_button_data_testid(data_testid)

@step("Enter text <text> in the <aria_label> search bar")
def send_text_into_search_bar(text: str, aria_label: str):
    APP.home_page.send_text_into_search_bar(text, aria_label)
@step("Select the following radio buttons <table>")
def click_radio_buttons(table):
    for k, v in enumerate(table):
        APP.home_page.click_radio_button(v[0])
        time.sleep(0.1)

@step("Is checkbox checked <table>")
def is_checkbox_checked(table):
    for k, v in enumerate(table):
        is_checkbox_enabeled = APP.home_page.is_facet_card_enum_checkbox_checked(v[0])
        assert is_checkbox_enabeled, f"The checkbox '{v[0]}' is NOT checked"
        time.sleep(0.1)

@step("Is checkbox not checked <table>")
def is_checkbox_not_checked(table):
    for k, v in enumerate(table):
        is_checkbox_disabeled = APP.home_page.is_facet_card_enum_checkbox_checked(v[0])
        assert is_checkbox_disabeled == False, f"The checkbox '{v[0]}' IS checked when it is unexpected"
        time.sleep(0.1)
