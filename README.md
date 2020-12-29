# COMPS381F Project
This is an Express server that provides basic CRUD services for the restaurants collection. <br>
Server is written by Care We Are (FYP Group): <br>
<ul>
	<li>Tso Tik Sum Dickson</li>
	<li>Lai Chaau Long Paul</li>
	<li>Wong Wai Kin Sam</li>
</ul>

### Features
<ul>
	<li>Show photo & map only when they are existed</li>
	<li>Edit & Delete function only available when the user is the owner</li>
	<li>Rate function only available when the user did not rate before</li>
	<li>Auto redirect to Home page when there is a message page</li>
	<li>Search by Name, Borough & Cuisine</li>
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
		<ul>
			<li>
				Restaurant documents may contain the following attributes:
				<ol>
					<li>restaurant_id</li>
					<li>name</li>
					<li>borough</li>
					<li>cuisine</li>
					<li>photo</li>
					<li>photo mimetype</li>
					<li>
						<ol>address
							<li>street</li>
							<li>building</li>
							<li>zipcode</li>
							<li>coord</li>
						</ol>
					</li>
					<li>
						<ol>grades
							<li>user</li>
							<li>score</li>
						</ol>
					</li>
					<li>owner</li>
				</ol>
			</li>
			<li>name and owner are mandatory; other attributes are optional</li>
		</ul>
	</li>
	<li>
		Update restaurant documents
		<ul>
			<li>A document can only be updated by its owner (i.e. the user who created the document)</li>
		</ul>
	</li>
	<li>
		Rate restaurant. A restaurant can only be rated once by the same user.
		<ul>
			<li>score > 0 and score <= 10</li>
		</ul>
	</li>
	<li>
		Display restaurant documents
		<ul>
			<li>Show photo if it's available</li>
			<li>Show a link to Leaflet if coord is available</li>
		</ul>
	</li>
	<li>
		Delete restaurant documents
		<ul>
			<li>A document can only be deleted by its owner</li>
		</ul>
	</li>
	<li>
		Search
		<ul>
			<li>by name, borough, cuisine or borough.</li>
		</ul>
	</li>
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
