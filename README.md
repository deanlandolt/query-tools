The array-tools package is a small collection of modules that offer conveniences
for handling and querying javascript arrays both large and small.

resource-query
========

Perstore provides a query parsing and execution library called resource-query, which is
based on resource query language (RQL). RQL can be thought as basically a set of
nestable named operators which each have a set of arguments. RQL is designed to
have an extremely simple, but extensible grammar that can be written in a URL friendly query string. A simple RQL
query with a single operator that indicates a search for any resources with a property of
"foo" that has value of 3 could be written:

    eq(foo,3)

RQL is a compatible superset of standard HTML form URL encoding. The following query
is identical to the query (it is sugar for the query above):

    foo=3

We can use this query format to query stores and models. For example:

    MyModel.query("foo=3").forEach(function(object){
       // for each object with a property of foo equal to 3
    });

We can also construct queries using chained operator calls in JavaScript. We could
write this query:

    MyModel.query().eq("foo",3).forEach(...);

The RQL grammar is based around standard URI delimiters. The standard rules for 
encoding strings with URL encoding (%xx) are observed. RQL also supersets FIQL. 
Therefore we can write a query that finds resources with a "price" property below
10 with a "lt" operator using FIQL syntax:

    price=lt=10

Which is identical (and sugar for call operator syntax known as the normalized form):

    lt(price,10)

One can combine conditions with multiple operators with "&":

    foo=3&price=lt=10

Is the same as:

    eq(foo,3)&lt(price,10)

Which is also the same as:

    and(eq(foo,3),lt(price,10))

And thus can be used to query a store:

	MyModel.query("foo=3&price=lt=10")...

Or using chained JS calls to perform the same query:

    MyModel.query().eq("foo",3).lt("price",10)...

The | operator can be used to indicate an "or" operation. We can also use paranthesis
to group expressions. For example:

    (foo=3|foo=bar)&price=lt=10
    
Which is the same as:

    and(or(eq(foo,3),eq(foo,bar)),lt(price,10))

And to query a model/store:

    MyModel.query("(foo=3|foo=bar)&price=lt=10")...
    
And using chained JS calls: 

	var query = MyModel.query();
	query.or(query.eq("foo",3),query.eq("foo","bar")).lt("price",10)...

Sometimes it makes sense to use the with statement (despite the fact that some 
think it should never be used). This actually makes the syntax look very similar
to the query string format. For example:

	with(MyModel.query()){
		or(eq("foo",3),eq("foo","bar")).lt("price",10)...
	}

Values in queries can be strings (using URL encoding), numbers, booleans, null, undefined,
and dates (in ISO UTC format without colon encoding). We can also denote arrays
with paranthesis enclosed, comma separated values. For example to find the objects
where foo can be the number 3, the string bar, the boolean true, or the date for the
first day of the century we could write an array with the "in" operator:

    foo=in=(3,bar,true,2000-01-01T00:00:00Z)

We can also explicitly specify primitive types in queries. To explicitly specify a string "3",
we can do:

    foo=string:3

Any property can be nested by using a dot syntax. To search by the bar property of
the object in the foo property we can do:

    foo.bar=3
    
Another common operator is sort. We can use the sort operator to sort by a specified property.
To sort by foo in ascending order:
	
	price=lt=10&sort(+foo)

We can also do multiple property sorts. To sort by price in ascending order and rating in descending order:

    sort(+price,-rating)

The aggregate function can be used for aggregation. To calculate the sum of sales for
each department:

    aggregate(departmentId,sum(sales))
        
Here is a definition of the common operators (individual stores may have support
for more less operators):

* sort(&lt;+|->&lt;property) - Sorts by the given property in order specified by the prefix (+ for ascending, - for descending)  
* select(&lt;property>) - Returns an array of the given property value for each object
* select(&lt;property>,&lt;property>,...) - Trims each object down to the set of properties defined in the arguments
* aggregate(&lt;property|function>,...) - Aggregates the array, grouping by objects that are distinct for the provided properties, and then reduces the remaining other property values using the provided functions
* distinct() - Returns a result set with duplicates removed 
* in(&lt;property>,&lt;array-of-values>) - Filters for objects where the specified property's value is in the provided array
* contains(&lt;property>,&lt;value | array-of-values>) - Filters for objects where the specified property's value is an array and the array contains the provided value or contains a value in the provided array
* slice(start,end) - Returns the given range of objects from the result set
* and(&lt;query>,&lt;query>,...) - Applies all the given queries
* or(&lt;query>,&lt;query>,...) - The union of the given queries
* eq(&lt;property>,&lt;value>) - Filters for objects where the specified property's value is equal to the provided value
* lt(&lt;property>,&lt;value>) - Filters for objects where the specified property's value is less than the provided value
* le(&lt;property>,&lt;value>) - Filters for objects where the specified property's value is less than or equal to the provided value
* gt(&lt;property>,&lt;value>) - Filters for objects where the specified property's value is greater than the provided value
* ge(&lt;property>,&lt;value>) - Filters for objects where the specified property's value is greater than or equal to the provided value
* ne(&lt;property>,&lt;value>) - Filters for objects where the specified property's value is not equal to the provided value
* sum(&lt;property?>) - Finds the sum of every value in the array or if the property argument is provided, returns the sum of the value of property for every object in the array 
* mean(&lt;property?>) - Finds the mean of every value in the array or if the property argument is provided, returns the mean of the value of property for every object in the array 
* max(&lt;property?>) - Finds the maximum of every value in the array or if the property argument is provided, returns the maximum of the value of property for every object in the array 
* min(&lt;property?>) - Finds the minimum of every value in the array or if the property argument is provided, returns the minimum of the value of property for every object in the array 
* recurse(&lt;property?>) - Recursively searches, looking in children of the object as objects in arrays in the given property value


If you are writing a store, or want to introspect queries, you can use the parsed query data 
structures. You can parse string queries with resource-query module's parseQuery function.
Query objects have a "name" property and an "args" with an array of the arguments.
For example:

	require("array-tools/resource-query").parseQuery("(foo=3|foo=bar)&price=lt=10") ->
	{
		name: "and",
		args: [
			{
				name:"or",
				args:[
					{
						name:"eq",
						args:["foo",3]
					},
					{
						name:"eq",
						args:["foo","bar"]
					}
				]
			},
			{
				name:"or",
				args:["price",10]
			}
		]
	}
				
Licensing
--------

The array-tools package is part of the Persevere project, and therefore is licensed under the
AFL or BSD license. The Persevere project is administered under the Dojo foundation,
and all contributions require a Dojo CLA.

Project Links
------------

See the main Persevere project for more information:

### Homepage:

* [http://persvr.org/](http://persvr.org/)

### Source & Download:

* [http://github.com/kriszyp/perstore/](http://github.com/kriszyp/perstore)

### Mailing list:

* [http://groups.google.com/group/persevere-framework](http://groups.google.com/group/persevere-framework)

### IRC:

* [\#persevere on irc.freenode.net](http://webchat.freenode.net/?channels=persevere)