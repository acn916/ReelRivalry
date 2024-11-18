import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time


class CreateTournamentTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()

    def setUp(self):
        self.driver.get('http://localhost:3000/login')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "login-input")))

    def login(self):
        self.driver.find_element(By.ID, "login-input").send_keys("austin.n@gmail.com")
        self.driver.find_element(By.ID, "password-input").send_keys("Austin123")
        self.driver.find_element(By.ID, "login-button").click()

        WebDriverWait(self.driver, 10).until(EC.url_to_be('http://localhost:3000/dashboard'))

        self.driver.find_element(By.ID, "menu-button").click()
        self.driver.find_element(By.ID,"create-tournament-option").click()

        WebDriverWait(self.driver, 10).until(EC.url_to_be('http://localhost:3000/create-tournament'))

        create_tournament_url = self.driver.current_url

        self.assertEqual(create_tournament_url, "http://localhost:3000/create-tournament")

    def test_1_valid_tournament_input(self):
        
        self.login()

        self.driver.find_element(By.ID, "tournament-name").send_keys("test")
        
        # Select date
        calendar_button = self.driver.find_element(By.XPATH, '//*[contains(@aria-label, "Choose date")]')
        calendar_button.click()

        date_button = self.driver.find_element(By.XPATH, "//button[contains(text(), '12')]")  # Example for 9th of November
        date_button.click()

        # Select time
        time_button = self.driver.find_element(By.XPATH, '//button[contains(@aria-label, "Choose time, selected time is 8:00 AM")]')
        time_button.click()

        hours_slot = self.driver.find_element(By.XPATH, '//li[@aria-label="9 hours"]')
        hours_slot.click()

        # Wait for minute slot to be visible and clickable, then attempt click
        minutes_slot = self.driver.find_element(By.XPATH, '//li[@aria-label="30 minutes"]')
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", minutes_slot)

        WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable(minutes_slot)
        )
        minutes_slot.click()

        # Select AM/PM slot
        meridiem_slot = self.driver.find_element(By.XPATH, '//li[@aria-label="PM"]')
        self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", meridiem_slot)
        
        WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable(meridiem_slot)
        )
        meridiem_slot.click()

        # Select duration
        duration_button = self.driver.find_element(By.XPATH, '//button[@aria-label="Choose time"]')
        duration_button.click()

        
        # Find the option with the aria-label for 3 hours
        duration_hours = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//li[@aria-label="3 hours"]'))
        )

        duration_hours.click()

        # Locate the 'OK' button by its visible text and click it
        ok_button = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//button[text()='OK']"))
        )

        ok_button.click()

        # Locate the dropdown and click to open it
        species = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "#tournament-species"))
        )
        species.click()

        # Locate and select the "Bass" option from the dropdown
        trout_option = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//li[text()='Trout']"))
        )
        trout_option.click()

        self.driver.find_element(By.ID, "tournament-submit-button").click()

    def test_2_no_entry_error(self):
        self.login()

        self.driver.find_element(By.ID, "tournament-submit-button").click()

        error1 = self.driver.find_element(By.ID, "tournament-error").text
        self.assertEqual(error1, "Please fill in all fields")

    

        
    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
