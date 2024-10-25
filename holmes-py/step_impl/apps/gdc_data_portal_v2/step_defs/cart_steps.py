from getgauge.python import step, before_spec

from ..app import GDCDataPortalV2App
from ....base.webdriver import WebDriver

@before_spec
def start_app():
    global APP
    APP = GDCDataPortalV2App(WebDriver.page)

@step("Remove <all_files_or_authorized_files> from cart on the Cart page")
def remove_all_files_from_cart_page(all_files_or_authorized_files:str):
    APP.cart_page.remove_all_files_from_cart(all_files_or_authorized_files)

@step("Select <button_id> on the Cart page")
def click_cart_page_button(button_id:str):
    APP.cart_page.click_button_cart_page(button_id)
