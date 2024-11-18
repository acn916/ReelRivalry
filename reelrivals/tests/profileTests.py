import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class LoginTests(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()

    def setUp(self):
        self.driver.get('http://localhost:3000/login')


    def login(self):

        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "login-input")))
        self.driver.find_element(By.ID, "login-input").send_keys("austin.n@gmail.com")
        self.driver.find_element(By.ID, "password-input").send_keys("Austin123")
        self.driver.find_element(By.ID, "login-button").click()

        WebDriverWait(self.driver, 10).until(
            EC.url_to_be('http://localhost:3000/dashboard')
        )

    def test_1_user_information_displayed(self):
        self.login()

        self.driver.find_element(By.ID, "avatar-icon").click()
        
        user_option = WebDriverWait(self.driver, 10).until(
            EC.element_to_be_clickable((By.ID, "user-option"))
        )
        user_option.click()

        WebDriverWait(self.driver, 10).until(
            EC.url_to_be('http://localhost:3000/profile')
        )
        user_profile_url = self.driver.current_url
        self.assertEqual(user_profile_url, 'http://localhost:3000/profile')

        users_name = self.driver.find_element(By.ID, "users-full-name").text
        self.assertEqual(users_name, 'austin nguyen')

        users_email = self.driver.find_element(By.ID, "users-email").text
        self.assertEqual(users_email, 'austin.n@gmail.com')



    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

if __name__ == "__main__":
    unittest.main()
