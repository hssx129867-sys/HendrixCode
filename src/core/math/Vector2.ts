/**
 * 2D Vector implementation for screen coordinates and 2D math operations.
 */
export class Vector2 {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  /**
   * Creates a new Vector2 with the same values as this one.
   */
  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  /**
   * Sets the components of this vector.
   */
  set(x: number, y: number): Vector2 {
    this.x = x;
    this.y = y;
    return this;
  }

  /**
   * Adds another vector to this one.
   */
  add(v: Vector2): Vector2 {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   * Subtracts another vector from this one.
   */
  subtract(v: Vector2): Vector2 {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   * Multiplies this vector by a scalar.
   */
  multiplyScalar(scalar: number): Vector2 {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * Divides this vector by a scalar.
   */
  divideScalar(scalar: number): Vector2 {
    if (scalar === 0) {
      console.warn('Division by zero in Vector2.divideScalar');
      return new Vector2(0, 0);
    }
    return new Vector2(this.x / scalar, this.y / scalar);
  }

  /**
   * Calculates the dot product with another vector.
   */
  dot(v: Vector2): number {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * Calculates the length (magnitude) of this vector.
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * Calculates the squared length (avoids sqrt for performance).
   */
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Returns a normalized copy of this vector (length = 1).
   */
  normalize(): Vector2 {
    const len = this.length();
    if (len === 0) {
      return new Vector2(0, 0);
    }
    return this.divideScalar(len);
  }

  /**
   * Calculates distance to another vector.
   */
  distanceTo(v: Vector2): number {
    return this.subtract(v).length();
  }

  /**
   * Calculates squared distance to another vector (avoids sqrt).
   */
  distanceToSquared(v: Vector2): number {
    return this.subtract(v).lengthSquared();
  }

  /**
   * Linearly interpolates between this vector and another.
   * @param v - Target vector
   * @param t - Interpolation factor (0-1)
   */
  lerp(v: Vector2, t: number): Vector2 {
    return new Vector2(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t
    );
  }

  /**
   * Checks if this vector equals another vector.
   */
  equals(v: Vector2, epsilon: number = 0.000001): boolean {
    return (
      Math.abs(this.x - v.x) < epsilon &&
      Math.abs(this.y - v.y) < epsilon
    );
  }

  /**
   * Returns a string representation of this vector.
   */
  toString(): string {
    return `Vector2(${this.x.toFixed(3)}, ${this.y.toFixed(3)})`;
  }

  /**
   * Converts to array [x, y].
   */
  toArray(): [number, number] {
    return [this.x, this.y];
  }

  /**
   * Creates a Vector2 from an array.
   */
  static fromArray(arr: number[]): Vector2 {
    return new Vector2(arr[0] || 0, arr[1] || 0);
  }

  /**
   * Creates a zero vector.
   */
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  /**
   * Creates a unit vector (1, 1).
   */
  static one(): Vector2 {
    return new Vector2(1, 1);
  }

  /**
   * Creates a unit X vector (1, 0).
   */
  static unitX(): Vector2 {
    return new Vector2(1, 0);
  }

  /**
   * Creates a unit Y vector (0, 1).
   */
  static unitY(): Vector2 {
    return new Vector2(0, 1);
  }
}
