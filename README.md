# COMPS381F Project
This is an Express server that provides basic CRUD services for the restaurants collection.

### Functional Requirements
1. Create user accounts
		• Each user account has a userid and password.
		• Upon successful login, userid must be stored in cookie session
2. Create new restaurant documents
		• Restaurant documents may contain the following attributes:
			i. restaurant_id
			ii. name
			iii. borough
			iv. cuisine
			v. photo
			vi. photo mimetype
			vii. address
				1. street
				2. building
				3. zipcode
				4. coord
			viii. grades
				1. user
				2. score
			ix. owner
		• name and owner are mandatory; other attributes are optional
3. Update restaurant documents
		• A document can only be updated by its owner (i.e. the user who created the document)
4. Rate restaurant. A restaurant can only be rated once by the same user.
		• score > 0 and score <= 10
5. Display restaurant documents
		• Show photo if it's available
		• Show a link to Leaflet if coord is available
6. Delete restaurant documents
		• A document can only be deleted by its owner
7. Search
		• by name, borough, cuisine or borough.

### Installing
```
npm install
```
### Running
```
node server.js
```
### Testing
Go to http://localhost:8099
