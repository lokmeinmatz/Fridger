use actix::prelude::*;

struct DatabaseRequest {
    queryString: String
}

impl Message for DatabaseRequest {
    type Result = string
}

struct DatabaseActor {
}

impl Actor for DatabaseActor {
    type Context = Context<Self>;

}