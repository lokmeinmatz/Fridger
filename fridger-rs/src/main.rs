use log::{info};
use actix_web::{web, App, HttpResponse, HttpServer, Responder};


fn status_html() -> impl Responder {
    HttpResponse::Ok().body("API v1 running!")
}

fn main() {
    simple_logger::init_with_level(log::Level::Info).unwrap();

    info!("Starting FRIDGER-RS");

    HttpServer::new(|| {
        App::new()
            .route("/api/v1/", web::get().to(status_html))
    })
    .bind("127.0.0.1:8088")
    .unwrap()
    .run()
    .unwrap();
}
