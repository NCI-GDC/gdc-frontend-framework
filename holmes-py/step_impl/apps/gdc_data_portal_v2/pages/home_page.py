from playwright.sync_api import Page


class HomePageLocators:
    """A class for Home page locators. All home page locators should come here"""
    NAV_NIH_LOGO = "img[data-testid='NIH_LOGO']"
    NAV_BAR_ANALYSIS_ICON= "img[alt='Analysis logo']"
    NAV_BAR_PROJECT_ICON = "img[alt='Studies logo']"   
    NAV_BAR_COHORT_ICON = "img[alt='Cohort logo']"    
    NAV_BAR_REPOSITORY_ICON = "img[alt='Downloads logo']"   

    NAV_DEFAULT_ANALYSIS_ICON = "img[alt='Analysis_Center_Card']"
    NAV_DEFAULT_STUDIES_ICON = "img[alt='Studies_Card']"
    NAV_DEFAULT_COHORT_ICON = "img[alt='Cohort_Card']"
    NAV_DEFAULT_REPOSITORY_ICON = "img[alt='Downloads_Card']"
    


class HomePage:
    def __init__(self, driver: Page, url):
        self.URL = "{}/".format(url)
        self.driver = driver  # driver is PW page

    """Home page actions """

    def visit(self):
        self.driver.goto(self.URL)
