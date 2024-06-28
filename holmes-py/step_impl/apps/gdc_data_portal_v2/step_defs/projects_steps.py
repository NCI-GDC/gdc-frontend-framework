from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver


@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)


@step("Select <button_name> on the Projects page")
def select_repository_page_button(button_name: str):
    APP.projects_page.click_shortened_name_button(button_name)


@step("Select <button_name> projects row on the Projects page")
def click_projects_row(button_name: str):
    APP.projects_page.click_button_select_project_row(button_name)
