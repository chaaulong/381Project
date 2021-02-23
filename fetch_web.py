'''
Problems:
Hard to get cert requirement from job descriptions
Response with graph
Cannot fetch content after page rendered

'''


from bs4 import BeautifulSoup
import requests
import re
import pymongo
from requests_html import HTMLSession
from selenium import webdriver  
from selenium.webdriver import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.common.by import By
import time

#### DB ####
dburl = 'mongodb+srv://fyp:fyp@cluster0.rvl5l.mongodb.net/FYP?retryWrites=true&w=majority'

dbclient = pymongo.MongoClient(dburl)
db_fyp = dbclient["FYP"]
col_jobs = db_fyp['jobs']
col_cert = db_fyp['cert']
col_example = db_fyp['example']
# print(db_fyp.list_collection_names())

# for job in db_fyp['jobs'].find():
#     print(job)



#### Fetch ####
class Jobs:
    def __init__(self, totalpages=None, joblinks=None):
        self.totalpages = totalpages
        self.joblinks = joblinks

    def getJobsTotalPages(self, job: str) -> int:
        req = requests.get(f'https://hk.jobsdb.com/hk/search-jobs/{job}/1')
        soup = BeautifulSoup(req.text, 'lxml')
        #jobs = soup.find_all('div', class_ = 'FYwKg')
        #jobs = soup.find('div',{'class':'FYwKg','data-automation':'jobListing'})
        page = soup.find('select', {'id':'pagination'})
        totalpage = []
        for a in page:
            totalpage.append(a.text)
        self.totalpages = int(totalpage[-1])
        return int(totalpage[-1])

    def getJobsLinks(self, job: str) -> list:
        req = requests.get(f'https://hk.jobsdb.com/hk/search-jobs/{job}/1')
        soup = BeautifulSoup(req.text, 'lxml')
        jobs = soup.find('div',{'class':'FYwKg','data-automation':'jobListing'})
        link = jobs.find_all('a')
        joblinks=[]
        for x in link:
            for y in x.get('class'):
                if y=='DvvsL_0' or y=='_1p9OP':
                    joblinks.append(x.get('href'))
                    break
        self.joblinks = joblinks
        return joblinks

    def insertJobs(self, joblinks: list):
        for index, link in enumerate(joblinks, start=1):
            print(f'The {index} link: \n')
            req2 = requests.get('https://hk.jobsdb.com'+link)
            soup2 = BeautifulSoup(req2.text,'lxml')
            jobdesc = soup2.find('div',{'data-automation':'jobDescription','class':'vDEj0_0'})
            jobtitle = soup2.find('h1')
            company = soup2.find('div',{'data-automation':'detailsTitle'}).find('span')
            print(company.text)
            print(jobtitle.text)
            desc = jobdesc.find_all('li')
            description = ''
            for y in desc:    
                description += y.text
            job_dict = {'title': jobtitle.text, 'description': description, 'company': company.text}
            x = col_jobs.insert_one(job_dict)
            return x


class Cert:
    def __init__(self, totalpages=None, certlinks=None):
        self.totalpages = totalpages
        self.certlinks = certlinks

    def getMSCerts(self, product=None, role=None, level=None, certtype=None):
        driver = webdriver.Chrome()  
        
        driver.get(f'https://docs.microsoft.com/en-us/learn/certifications/browse/?products={product}&roles={role}&levels={level}&resource_type=certification')
        linklist = []
        infolist = []
        while True:
            try:
                links = WebDriverWait(driver,10).until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "#content-browser-container > div > div > div.column.is-full.is-three-fifths-tablet.is-three-quarters-widescreen > ul [href]")))
                items = WebDriverWait(driver,10).until(EC.presence_of_all_elements_located((By.CLASS_NAME,"grid-item")))
                time.sleep(0.5)
                for info in items:
                    item = (info.text)
                    lines = item.splitlines()
                    infolist.append([lines[1],lines[3]])
                 
                for href in links:
                    linklist.append(href.get_attribute('href'))

                time.sleep(0.5)
                WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, "//div/div/div[2]/div[4]/div[1]/nav/button[2]")))
                driver.find_element_by_xpath("//div/div/div[2]/div[4]/div[1]/nav/button[2]").click()
                print("Navigating to Next Page")
            except (TimeoutException) as e:
                print("Last page reached")
                break
        for index in range(len(infolist)):
            infodict= {'name':infolist[index][0],'association':'Microsoft','requiredExam':infolist[index][1],'url':linklist[index]}
            print(infodict)
            x = col_example.insert_one(infodict)
            
        driver.close()

    def getOracleCerts(self):
        print('Entered')
        session = HTMLSession()
        req = session.get('https://education.oracle.com/certification')
        soup = BeautifulSoup(req.text, 'lxml')
        req.html.render()
        print(req.html.html)
 
        certs = soup.find('div',{'class':'rc33w2'})
        link = certs.find_all('a')
        certlinks=[]
        for x in link:  
            certlinks.append(x.get('href'))
                 
        self.certlinks = certlinks
        return certlinks

        detail = soup.find('div', {'class': 'secondary'})
        link2 = detail.find_all('a')
        detailLinks=[]
        for x in link2:
             detailLinks.append(x.get('href'))
        self.detailLinks =  detailLinks
        return detailLinks 

    def insertOracle(self, certlinks: list, detailLinks: list):
        for index, link in enumerate(certlinks, start=1):
            print(f'The {index} link: \n')
            req2 = requests.get('https://education.oracle.com/'+link)
            soup2 = BeautifulSoup(req2.text,'lxml')
            certLv = soup2.find('div',{'class':'col-item-w1'})
            area = soup2.find('h4')
            certName = soup2.find('h5')
            print(certLv.text)
            print(area.text)
            print(certName.text)

        '''for index, link2 in enumerate(detailLinks, start=1):   
            print(f'The {index} link: \n')
            req3 = requests.get('https://education.oracle.com/'+link2)
            soup3 = BeautifulSoup(req3.text,'lxml')
            exam = soup3.find('div', {'class':'prod-title', 'a':'data-bind'})
            print(exam.text)'''
                       
            
            # cert_dict = {'name': certName.text, 'association': 'Oracle', 'level': certLv, 'required Exam': exam.text, 'url': req3.text}
            # x = col_cert.insert_one(cert_dict)
            # return x







if __name__ == '__main__':
    aJob = Jobs()
    testMSCert = Cert()
    testMSCert.getMSCerts('','','','')
   # testOracleCerts = Cert()
    #testOracleCerts.getOracleCerts()