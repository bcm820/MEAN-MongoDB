
Terminal
---------
First you run the server on a terminal instance, and then you access its terminal.
# sudo mongod
# mongo

Mongo: Schema
-------------
List databases, select a <database> (create it if it doesn't exist), and delete it.
# show dbs
# use <database>
# db.dropDatabase()

Mongo: Collections
------------------
# show collections
# db.createCollection('<collection>')
# db.<collection>.drop()


Mongo: Create, Read, Destroy Operations
---------------------------------------

To CREATE a 'document':
# db.<collection>.insert({key1:value1, key2:value2})

To READ all documents:
# db.<collection>.find()

To READ all documents formatted nicely:
# db.<collection>.find().pretty()

To READ documents that match key criteria:
# db.<collection>.find({key:value})
# e.g. db.users.find({name: 'Brian'})

NOTE: Mongo appends an '_id' field with an ObjectId to every document:
# "_id" : ObjectId("5a1d7ee823b467d64bc5d80d")
You can sort by creation time by ObjectId because a timestamp is part of the string

To DESTROY all documents that match key criteria:
# db.<collection>.remove({key:value})

To DESTROY only one document when multiple documents match key criteria:
(the 'true' refers to a 'remove one' bool)
# db.<collection>.remove({key:value}, true)


Mongo: Query Operators
----------------------
To select documents that meet query parameters:
# db.<collection>.find({key: {$<operator>: value}})
# e.g. db.users.find({'age': {$gt: 21}})

List of Operators:
# ${$not}: Returns documents that do not match query expression
# ${$nor}: Joins query clause with logical NOR that fail both clauses
# ${$or}: Joins query clause with logical OR that meet either clause
# ${gt}: Greater than
# ${gte}: Greater than or equal to
# ${lt}: Less than
# ${lte}: Less than or equal to
# ${in}: In array (e.g. {interests: {$in: "coding"} })
(see below)


Mongo: Update Operations
------------------------
To UPDATE an entire document, pass in a query and all key/value pairs:
- For this method, you MUST enter in all data for that document again!
# db.<collection>.updateOne({key:value}, {key1:value1, key2:value2, key3:value3 . . . })
# e.g. db.users.updateOne({'username':'bcmendoza'}, {'username':'bcmendoza', 'first':'Brian'})

To add a new key/value pair:
# db.<collection>.updateOne({key:value}, {$set: {key:value} })
# e.g. db.users.updateOne({'username':'bcmendoza'}, {$set: {title:"Full Stack Developer"} })

NOTE: NoSQL databases can store multiple values in one column!
# e.g. Brian can have many interests (e.g. coding, eating, biking)

To add to an array in one of its keys:
# db.<collection>.updateOne({key:value}, {$addToSet: {array_key:value} })
# e.g. db.users.updateOne({'username':'bcmendoza'}, {$addToSet: {interests:"many other things"} })
{
    "_id" : ObjectId("346364363643463464"),
    "username" : "bcmendoza",
    ...
    "interests" : [
        "coding",
        "eating",
        "biking",
        "many other things" <- just added via $push!
    ]
}

To add to an array, allowing for duplicate values in a list:
# db.<collection>.updateOne({key:value}, {$push: {array_key:same_value}})

To remove from an array via location, use 1 to pop last, -1 to pop first
# db.<collection>.updateOne({key:value}, {$pop: {array_key: (1 or -1)} })
# e.g. db.<collection>.updateOne({'username':'bcmendoza'}, {$pop: {'interests': -1} })

To remove from an array via value:
# db.<collection>.updateOne({key:value}, {$pull: {array_key: value}})
# e.g. db.users.updateOne({'username':'bcmendoza'}, {$pull: {'interests':'biking'} })