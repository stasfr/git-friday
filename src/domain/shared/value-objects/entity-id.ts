export abstract class EntityId {
  protected readonly _value: string;

  protected constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  public equals(id?: EntityId): boolean {
    if (id === undefined) {
      return false;
    }

    if (!(id instanceof this.constructor)) {
      return false;
    }

    return id.value === this.value;
  }
}
