from playwright.sync_api import Page


class HomePageLocators:
    """A class for Home page locators. All home page locators should come here"""
    NAV_NIH_LOGO = "img[data-test='NIH_LOGO']"
    NAV_BAR_ANALYSIS_ICON = "img[alt='Analysis logo']"
    NAV_BAR_PROJECT_ICON = "img[alt='Studies logo']"   
    NAV_BAR_COHORT_ICON = "img[alt='Cohort logo']"    
    NAV_BAR_REPOSITORY_ICON = "img[alt='Downloads logo']"   

    NAV_DEFAULT_ANALYSIS_ICON = "text='Analysis Center'"
    NAV_DEFAULT_COHORT_ICON = "main[data-tour='full_page_content'] >> img[src='/user-flow/icons/build.svg']"
    NAV_DEFAULT_REPOSITORY_ICON = "main[data-tour='full_page_content'] >> img[src='/user-flow/icons/database.svg']"
    


class HomePage:
    def __init__(self, driver: Page, url):
        self.URL = "{}/".format(url)
        self.driver = driver  # driver is PW page

    """Home page actions """

    def visit(self):
        self.driver.goto(self.URL)
