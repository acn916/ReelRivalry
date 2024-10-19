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

    def test_1_valid_login(self):
        self.login('austin.n916@gmail.com', 'Austin123')
        
        # Wait for the URL to change to the dashboard
        WebDriverWait(self.driver, 10).until(EC.url_to_be('http://localhost:3000/dashboard'))
        current_url = self.driver.current_url
        self.assertEqual(current_url, 'http://localhost:3000/dashboard')

    def test_2_invalid_login(self):
        self.login('austin.n916@gmail.com', 'aaaa')
        
        # Wait for the error message to appear
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "error-output")))
        self.assertIn("Invalid user name or password", self.driver.page_source)

    def test_3_no_login_information(self):
        self.login('', '')
        
        # Wait for the error message to appear
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "input-required")))
        self.assertIn("Please enter a email", self.driver.page_source)

    def test_4_username_no_password(self):
        self.login('austin.n916@gmail.com', '')
        
        # Wait for the error message to appear
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "input-required")))
        self.assertIn("Please enter a password", self.driver.page_source)

    def test_5_password_no_username(self):
        self.login('', 'password')
        
        # Wait for the error message to appear
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "input-required")))
        self.assertIn("Please enter a email", self.driver.page_source)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
