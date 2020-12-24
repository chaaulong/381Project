# COMPS381F Project
This is an Express server that provides basic CRUD services for the restaurants collection. <br>
Server is written by Care We Are (FYP Group): <br>
<ul>
	<li>Tso Tik Sum Dickson</li>
	<li>Lai Chaau Long Paul</li>
	<li>Wong Wai Kin Sam</li>
</ul>

### Functional Requirements
<ol>
	<li>
	Create user accounts
	<ul>
		<li>Each user account has a userid and password.</li>
		<li>Upon successful login, userid must be stored in cookie session.</li>
	</ul>
	</li>
	<li>
	Create new restaurant documents
	<ol>
	Restaurant documents may contain the following attributes:
		<li>restaurant_id</li>
		<li>name</li>
		<li>borough</li>
		<li>cuisine</li>
		<li>photo</li>
		<li>photo mimetype</li>
			vii. address
				1. street
				2. building
				3. zipcode
				4. coord
			viii. grades
				1. user
				2. score
			ix. owner
	</ol>
		• name and owner are mandatory; other attributes are optional
	</li>
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
			</ol>

### Installing
```
npm install
```
### Running
```
npm start
```
### Testing
Go to http://localhost:8099
