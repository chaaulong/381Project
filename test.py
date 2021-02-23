import sys
import json
import pymongo

dburl = 'mongodb+srv://fyp:fyp@cluster0.rvl5l.mongodb.net/FYP?retryWrites=true&w=majority'

dbclient = pymongo.MongoClient(dburl)
db_fyp = dbclient["FYP"]
col_jobs = db_fyp['jobs']
col_cert = db_fyp['cert']
col_example = db_fyp['example']


# a Python object (dict):
for x in col_example.find({'name': 'Microsoft Certified: Azure for SAP Workloads Specialty'},{ "_id": 0}):
  searcheddata = x
# convert into JSON:
y = json.dumps(searcheddata)
print(y)  
sys.stdout.flush()

#data = r.json()