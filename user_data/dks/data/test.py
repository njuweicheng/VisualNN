from selenium import webdriver

dest = 'http://ubuntu:6006'
#options = webdriver.FireFoxOptions()
#options.add_argument('--ignore-certificate-errors')
#browser = webdriver.Firefox(firefox_options=options)
browser = webdriver.Firefox()
browser.get(url=dest)

