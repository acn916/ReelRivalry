import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class signUpTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.driver = webdriver.Chrome()
    
    def setUp(self):
        self.driver.get('http://localhost:3000/')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "firstname-input")))

    def login(self, fname, lname, email, password, password_reentry):
        self.driver.find_element(By.ID, "firstname-input").send_keys(fname)
        self.driver.find_element(By.ID, "lastname-input").send_keys(lname)
        self.driver.find_element(By.ID, "email-input").send_keys(email)
        self.driver.find_element(By.ID, "password-input").send_keys(password)
        self.driver.find_element(By.ID, "password-reentry-input").send_keys(password_reentry)
        self.driver.find_element(By.ID, "signup-button").click()

    def test_1_valid_signup(self):
        self.login('Austin', 'Nguyen', 'Austin.Nguyen54654@gmail.com', 'Austin123', 'Austin123')
        
        WebDriverWait(self.driver, 10).until(EC.url_to_be('http://localhost:3000/dashboard'))
        current_url = self.driver.current_url
        self.assertEqual(current_url, 'http://localhost:3000/dashboard')

    def test_2_active_account(self):
        self.login('Austin', 'Nguyen', 'Austin.Nguyen54654@gmail.com', 'Austin123', 'Austin123')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "error-output")))
        self.assertIn("Firebase: Error (auth/email-already-in-use)", self.driver.page_source)

    def test_3_no_first_name(self):
        self.login('', 'Nguyen', 'Austin.n916@gmail.com', 'Austin123', 'Austin123')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "input-required")))
        self.assertIn("Please enter a first name", self.driver.page_source)

    def test_4_no_last_name(self):
        self.login('Austin', '', 'Austin.n@email.com', 'password', 'password')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "input-required")))
        self.assertIn("Please enter a last name", self.driver.page_source)

    def test_5_no_email(self):
        self.login('Austin', 'Nguyen', '', 'Austin123', 'Austin123')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "input-required")))
        self.assertIn("Please enter a email", self.driver.page_source)

    def test_6_no_password(self):
        self.login('Austin', 'Nguyen', 'Austin.n@email.com', '', 'Austin123')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "input-required")))
        self.assertIn("Please enter a password", self.driver.page_source)

    def test_7_no_password_reentry(self):
        self.login('Austin', 'Nguyen', 'Austin.n@email.com', 'Austin123', '')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "input-required")))
        self.assertIn("Please re-enter password", self.driver.page_source)
    
    def test_8_password_no_match(self):
        self.login('Austin', 'Nguyen', 'Austin.n@email.com', 'werwerwere', 'Austin123')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "input-required")))
        self.assertIn("Password does not match", self.driver.page_source)
    
    def test_9_password_length(self):
        self.login('Austin', 'Nguyen', 'Austin.n@email.com', 'a', 'a')
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, "input-required")))
        self.assertIn("Password should be at least 6 characters", self.driver.page_source)

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()
    
if __name__ == "__main__":
    unittest.main()

