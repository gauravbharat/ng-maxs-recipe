export class User {
  constructor(
    public email: string,
    public id: string,
    private _token: string,
    private _tokenExpirationDate: Date
  ) {}

  // access getter like a property, code is run when accessing the property
  // setter not allowed for this getter
  get token() {
    // Check token expiry
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate)
      return null;
    return this._token;
  }
}
