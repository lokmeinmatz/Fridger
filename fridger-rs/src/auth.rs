use log::{info};
use actix_web::{web, http, HttpResponse, Responder};
use serde::{Serialize, Deserialize};


#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    user: String,
    uuid: String,
    exp: usize,
}

#[derive(Deserialize)]
pub struct LoginReq {
    username: String,
    password: String
}

pub fn login(req_body: web::Json<LoginReq>) -> impl Responder {
    info!(target: "auth", "Login request from {}", req_body.username);
    HttpResponse::Accepted()
    .set_header(http::header::CONTENT_TYPE, "application/json")
    .body("{\"accepted\": true}")
}