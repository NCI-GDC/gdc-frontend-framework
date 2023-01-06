import time

from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


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
    # Navigate to "Repository" from "Analysis" page
    pages = {
        "Repository": {
            "modal": APP.repository_page.click_button,
        },
        "Analysis": {"page": APP.analysis_page.navigate_to_tool},
    }
    pages.get(source)[target_type](target)


@step("Verify that the <text> text is displayed on <source> <target_type>")
def verify_text_on_page(text, page_name, target_type):
    pages = {
        "Repository": {"page": APP.repository_page.get_title},
        "Add a File Filter": {"modal": APP.repository_page.get_text_on_modal},
    }
    first_text = text.split(" ")[0]
    try:
        text_value = pages.get(page_name)[target_type](text)
    except:
        text_value = pages.get(page_name)[target_type](first_text)
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
