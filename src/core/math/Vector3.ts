/**
 * 3D Vector implementation for positions, directions, and scales in 3D space.
 */
export class Vector3 {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0
  ) {}

  /**
   * Creates a new Vector3 with the same values as this one.
   */
  clone(): Vector3 {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * Sets the components of this vector.
   */
  set(x: number, y: number, z: number): Vector3 {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  /**
   * Copies values from another vector.
   */
  copy(v: Vector3): Vector3 {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  /**
   * Adds another vector to this one.
   */
  add(v: Vector3): Vector3 {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  /**
   * Subtracts another vector from this one.
   */
  subtract(v: Vector3): Vector3 {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  /**
   * Multiplies this vector by a scalar.
   */
  multiplyScalar(scalar: number): Vector3 {
    return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
  }

  /**
   * Divides this vector by a scalar.
   */
  divideScalar(scalar: number): Vector3 {
    if (scalar === 0) {
      console.warn('Division by zero in Vector3.divideScalar');
      return new Vector3(0, 0, 0);
    }
    return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
  }

  /**
   * Calculates the dot product with another vector.
   */
  dot(v: Vector3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * Calculates the cross product with another vector.
   */
  cross(v: Vector3): Vector3 {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  /**
   * Calculates the length (magnitude) of this vector.
   */
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  /**
   * Calculates the squared length (avoids sqrt for performance).
   */
  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  /**
   * Returns a normalized copy of this vector (length = 1).
   */
  normalize(): Vector3 {
    const len = this.length();
    if (len === 0) {
      return new Vector3(0, 0, 0);
    }
    return this.divideScalar(len);
  }

  /**
   * Calculates distance to another vector.
   */
  distanceTo(v: Vector3): number {
    return this.subtract(v).length();
  }

  /**
   * Calculates squared distance to another vector (avoids sqrt).
   */
  distanceToSquared(v: Vector3): number {
    return this.subtract(v).lengthSquared();
  }

  /**
   * Linearly interpolates between this vector and another.
   * @param v - Target vector
   * @param t - Interpolation factor (0-1)
   */
  lerp(v: Vector3, t: number): Vector3 {
    return new Vector3(
      this.x + (v.x - this.x) * t,
      this.y + (v.y - this.y) * t,
      this.z + (v.z - this.z) * t
    );
  }

  /**
   * Reflects this vector off a surface with the given normal.
   */
  reflect(normal: Vector3): Vector3 {
    const dot = this.dot(normal);
    return this.subtract(normal.multiplyScalar(2 * dot));
  }

  /**
   * Projects this vector onto another vector.
   */
  projectOnto(v: Vector3): Vector3 {
    const dot = this.dot(v);
    const lenSq = v.lengthSquared();
    if (lenSq === 0) return new Vector3(0, 0, 0);
    return v.multiplyScalar(dot / lenSq);
  }

  /**
   * Checks if this vector equals another vector.
   */
  equals(v: Vector3, epsilon: number = 0.000001): boolean {
    return (
      Math.abs(this.x - v.x) < epsilon &&
      Math.abs(this.y - v.y) < epsilon &&
      Math.abs(this.z - v.z) < epsilon
    );
  }

  /**
   * Returns a string representation of this vector.
   */
  toString(): string {
    return `Vector3(${this.x.toFixed(3)}, ${this.y.toFixed(3)}, ${this.z.toFixed(3)})`;
  }

  /**
   * Converts to array [x, y, z].
   */
  toArray(): [number, number, number] {
    return [this.x, this.y, this.z];
  }

  /**
   * Creates a Vector3 from an array.
   */
  static fromArray(arr: number[]): Vector3 {
    return new Vector3(arr[0] || 0, arr[1] || 0, arr[2] || 0);
  }

  /**
   * Creates a zero vector.
   */
  static zero(): Vector3 {
    return new Vector3(0, 0, 0);
  }

  /**
   * Creates a unit vector (1, 1, 1).
   */
  static one(): Vector3 {
    return new Vector3(1, 1, 1);
  }

  /**
   * Creates a unit X vector (1, 0, 0).
   */
  static unitX(): Vector3 {
    return new Vector3(1, 0, 0);
  }

  /**
   * Creates a unit Y vector (0, 1, 0).
   */
  static unitY(): Vector3 {
    return new Vector3(0, 1, 0);
  }

  /**
   * Creates a unit Z vector (0, 0, 1).
   */
  static unitZ(): Vector3 {
    return new Vector3(0, 0, 1);
  }

  /**
   * Creates an up vector (0, 1, 0).
   */
  static up(): Vector3 {
    return new Vector3(0, 1, 0);
  }

  /**
   * Creates a down vector (0, -1, 0).
   */
  static down(): Vector3 {
    return new Vector3(0, -1, 0);
  }

  /**
   * Creates a forward vector (0, 0, -1) in AR coordinate system.
   */
  static forward(): Vector3 {
    return new Vector3(0, 0, -1);
  }

  /**
   * Creates a back vector (0, 0, 1).
   */
  static back(): Vector3 {
    return new Vector3(0, 0, 1);
  }

  /**
   * Creates a left vector (-1, 0, 0).
   */
  static left(): Vector3 {
    return new Vector3(-1, 0, 0);
  }

  /**
   * Creates a right vector (1, 0, 0).
   */
  static right(): Vector3 {
    return new Vector3(1, 0, 0);
  }
}
