# tredisdao

After implementing the dao APIs for mysql and mongodb, I now want to implement the redis implementation.

After long analysis and thinking how to implement the dao-framework for redis and mongodb, I found the solution for mongo,
using superstruct and a picker-library for the schema. This already allow me do implement the tmongodao module.

The problem to implement the framework for mongo, was to define schemas. Redis has more limitations.
In redis different fields can not be indexed by activating the index. So with tredisdao I want to use the same schema.
I also want to define what fields should be indexed for searching. so the framework can handle the indexing. 
The best I can do now, is to change that limitation into the advantage. now I plan that every index can be on its own redis-db-server. In that way, one machine only need to store the data, it can serve them very fast using the ID. The Id can be found from other redis-db-server. it will increase networking at the app-server, but reduce the load on the actual Database.
and as the Database is the part in an App that is most difficult to scale, I consider this design decison for very good.