use uuid::Uuid;


pub struct User {
  pub uuid: Uuid,
  pub name: String,
  pub pw_hashed: String
}