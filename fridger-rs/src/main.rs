extern crate jsonwebtoken as jwt;

use log::{info, trace};
use actix_web::{web, App, HttpResponse, HttpServer, Responder};
use actix::Addr;

mod auth;
mod data;
mod database;

struct AppState {
    db: Addr<database::DatabaseActor>
}

fn status_html() -> impl Responder {
    HttpResponse::Ok().body("API v1 running!")
}

fn main() {
    simple_logger::init_with_level(log::Level::Info).unwrap();


    info!("Starting FRIDGER-RS");

    trace!("starting sync DB");
    let sys = actix::System::new("actix-sys");

    let addr = actix::SyncArbiter::start(1, || {
        database::DatabaseActor::new(rusqlite::Connection::open("./database.sqlite").expect("database not found"))
    });

    HttpServer::new(move || {
        App::new()
        .data(AppState{ db: addr.clone()})
        .service(
            web::scope("/api/v1")
            .route("/", web::get().to(status_html))
            .route("/login", web::post().to(auth::login))
        )
    })
    .bind("127.0.0.1:8088")
    .unwrap()
    .run()
    .unwrap();

}
