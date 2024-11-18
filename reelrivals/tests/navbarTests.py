import unittest
from selenium import webdriver
import time;
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException  # Add this import


class navbarTests(unittest.TestCase) :

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()

    def setUp(self):
        self.driver.get('http://localhost:3000')
    
    def test_1_login_button_visibility(self):

        login_button = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "login-button"))
        )
        self.assertTrue(login_button.is_displayed())

    def test_2_login_button_redirection(self):

        self.driver.find_element(By.ID, "login-button").click()
        current_url = self.driver.current_url
        self.assertEqual(current_url, "http://localhost:3000/login")

    def test_3_return_button_present(self):

        self.driver.find_element(By.ID, "login-button").click()

        return_button = WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "return-button"))
        )

        self.assertTrue(return_button.is_displayed())

    def test_4_return_button_redirection(self): 

        self.driver.find_element(By.ID, "login-button").click();

        WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "return-button"))
        )

        self.driver.find_element(By.ID, "return-button").click()
        current_url = self.driver.current_url
        self.assertEqual(current_url, "http://localhost:3000/")
    

    
    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()



if __name__ == "__main__":
    unittest.main()