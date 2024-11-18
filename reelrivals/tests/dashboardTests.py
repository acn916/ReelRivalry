import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()

    def setUp(self):
        self.driver.get('http://localhost:3000/login')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "login-input")))

    def login(self, username, password):
        self.driver.find_element(By.ID, "login-input").send_keys(username)
        self.driver.find_element(By.ID, "password-input").send_keys(password)
        self.driver.find_element(By.ID, "login-button").click()
        
        # Wait for the URL to change to the dashboard
        WebDriverWait(self.driver, 10).until(EC.url_to_be('http://localhost:3000/dashboard'))
        current_url = self.driver.current_url
        self.assertEqual(current_url, 'http://localhost:3000/dashboard')

    def test_1_dashboard_login(self):
        # Call login method with username and password
        self.login('austin.n@gmail.com', 'Austin123')
        
        # Check if the "Ongoing Tournaments" section is visible
        ongoing_section = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "section-ongoing-tournaments"))
        )
        self.assertTrue(ongoing_section.is_displayed(), "Ongoing Tournaments section is not visible")

        upcoming_section = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "section-upcoming-tournaments"))
        )
        self.assertTrue(upcoming_section.is_displayed(), "Upcoming Tournaments section in not visible")

        previous_section = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "section-previous-tournaments"))
        )
        self.assertTrue(previous_section.is_displayed(), "Prevoius tournaments section is not visible")

    def test_2_tournament_info_displayed(self):

        self.login('austin.n@gmail.com', 'Austin123')

        ot_name = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "ongoing-tournaments-name"))
        )

        self.assertEqual(ot_name.text, "test")

        ot_date = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "ongoing-tournaments-date"))
        )
        self.assertEqual(ot_date.text, "11-09-2024")


        ut_name = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "upcoming-tournaments-name"))
        )
        self.assertEqual(ut_name.text, "test")

        ut_date = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "upcoming-tournaments-date"))
        )

        self.assertEqual(ut_date.text, "11-10-2024")

        pt_name = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "previous-tournaments-name"))
        )

        self.assertEqual(pt_name.text, "test")

        pt_date = WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.ID, "previous-tournaments-date"))
        )

        self.assertEqual(pt_date.text, "11-07-2024")


    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
