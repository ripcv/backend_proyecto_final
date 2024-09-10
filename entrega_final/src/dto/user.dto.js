class UserDto {
  constructor(id, first_name, last_name, email, age, role, cartId, documents, last_connection) {
    this._id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.age = age;
    this.role = role;
    this.cartId = cartId;
    this.documents = documents
    this.last_connection = last_connection
  }
}

export default UserDto;
