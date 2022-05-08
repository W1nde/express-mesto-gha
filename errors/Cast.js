class Cast extends Error {
  constructor(message) {
    super(message);
    this.name = "Cast";
    this.statusCode = 400;
  }
}

module.exports = Cast;
