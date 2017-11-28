
# Create a database called 'my_first_db'.
# Create users collection. Each document you insert into this collection should have the following format: ({name: STRING, state: STRING, lucky_number: NUMBER, birthday: {month: NUMBER, day: NUMBER, year: NUMBER}})

# Create 5 users with the appropriate info.
db.users.insert({name: 'Brian', state: 'VA', lucky_number: 777, birthday: {month: 8, day: 20, year: 1984} })
db.users.insert({name: 'Jon', state: 'VA', lucky_number: 75, birthday: {month: 3, day: 14, year: 1985} })
db.users.insert({name: 'Olu', state: 'MD', lucky_number: 6, birthday: {month: 2, day: 9, year: 1984} })
db.users.insert({name: 'Motuma', state: 'MD', lucky_number: 73, birthday: {month: 1, day: 5, year: 1992} })
db.users.insert({name: 'Yassine', state: 'DC', lucky_number: 345, birthday: {month: 7, day: 30, year: 1989} })

# Get all users.
db.users.find().pretty()

# Retrieve all users who are from VA or MD.
db.users.find({ $or: [ {state:'VA'} , {state:'MD'} ] })

# Get all users whose lucky number is:
# - greater than 3
db.users.find({lucky_number: {$gt: 3} })
# - less than or equal to 10
db.users.find({lucky_number: {$lte: 10} })
# - between 1 and 9 (inclusive)
db.users.find({lucky_number:{$gte:1, $lte:9}})

# Add a field to each user collection called 'interests' that is an ARRAY.  It should contain the following entries: 'coding', 'brunch', 'MongoDB'. Do this in ONE operation.
db.users.update({name:{$exists:true}}, {interests:['coding','brunch','MongoDB']})

# Add some unique interests for each particular users into each of their interest arrays.

# Add the interest 'taxes' into someone's interest array.

# Remove the 'taxes' interest you just added.

# Remove all users who are from California (or Washington).

# Remove a user by name. 

# Remove a user whose lucky number is greater than 5 (JUST ONE)

# Add a field to each user collection called 'number_of_belts' and set it to 0.

# Increment this field by 1 for all users in Washington (Seattle Dojo).

# Rename the 'number_of_belts' field to 'belts_earned'

# Remove the 'lucky_number' field.

# Add a 'updated_on' field, and set the value as the current date.