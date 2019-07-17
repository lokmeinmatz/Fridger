use actix::prelude::*;
use rusqlite::{Connection, params, Row};
use crate::data::User;
use std::io;
use uuid::Uuid;
use log::{info, trace};


pub struct DatabaseActor {
    conn: Connection,
}

impl DatabaseActor {
    pub fn new(conn: Connection) -> Self {
        DatabaseActor { conn }
    }
}


impl Actor for DatabaseActor {
    type Context = SyncContext<Self>;
}

pub struct GetUser {
    name: String
}

impl Message for GetUser {
    type Result = io::Result<User>;
}

impl Handler<GetUser> for DatabaseActor {
    type Result = io::Result<User>;


    fn handle(&mut self, msg: GetUser, ctx: &mut Self::Context) -> Self::Result {
        trace!(target: "Database", "Get user {}", msg.name);
        if let Ok((uuid_str, name, pwhash)) = self.conn.query_row("SELECT uuid, name, pwhash FROM users WHERE name = ?", params![msg.name], 
            |row: &Row| Ok( (row.get::<usize, String>(0)?, row.get(1)?, row.get(2)?) ) ) {

            let uuid = Uuid::parse_str(&uuid_str).map_err(|_| io::Error::from(io::ErrorKind::InvalidData))?;
            Ok(User {uuid, name, pw_hashed: pwhash})
        }
        else {
            Err(io::Error::from(io::ErrorKind::InvalidData))
        }

    }
}