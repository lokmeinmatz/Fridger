extern crate jsonwebtoken as jwt;

use log::{info};
use actix_web::{web, App, HttpResponse, HttpServer, Responder};

mod auth;

fn status_html() -> impl Responder {
    HttpResponse::Ok().body("API v1 running!")
}

fn main() {
    simple_logger::init_with_level(log::Level::Info).unwrap();

    info!("Starting FRIDGER-RS");

    HttpServer::new(|| {
        App::new().service(
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
