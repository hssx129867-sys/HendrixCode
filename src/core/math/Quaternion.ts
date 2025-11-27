import { Vector3 } from './Vector3';

/**
 * Quaternion implementation for representing rotations in 3D space.
 * Uses the convention (x, y, z, w) where w is the scalar component.
 */
export class Quaternion {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public z: number = 0,
    public w: number = 1
  ) {}

  /**
   * Creates a new Quaternion with the same values as this one.
   */
  clone(): Quaternion {
    return new Quaternion(this.x, this.y, this.z, this.w);
  }

  /**
   * Sets the components of this quaternion.
   */
  set(x: number, y: number, z: number, w: number): Quaternion {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    return this;
  }

  /**
   * Copies values from another quaternion.
   */
  copy(q: Quaternion): Quaternion {
    this.x = q.x;
    this.y = q.y;
    this.z = q.z;
    this.w = q.w;
    return this;
  }

  /**
   * Multiplies this quaternion by another quaternion.
   */
  multiply(q: Quaternion): Quaternion {
    const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
    const y = this.w * q.y + this.y * q.w + this.z * q.x - this.x * q.z;
    const z = this.w * q.z + this.z * q.w + this.x * q.y - this.y * q.x;
    const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
    return new Quaternion(x, y, z, w);
  }

  /**
   * Returns the conjugate of this quaternion.
   */
  conjugate(): Quaternion {
    return new Quaternion(-this.x, -this.y, -this.z, this.w);
  }

  /**
   * Calculates the length (magnitude) of this quaternion.
   */
  length(): number {
    return Math.sqrt(
      this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
    );
  }

  /**
   * Returns a normalized copy of this quaternion.
   */
  normalize(): Quaternion {
    const len = this.length();
    if (len === 0) {
      return new Quaternion(0, 0, 0, 1);
    }
    return new Quaternion(
      this.x / len,
      this.y / len,
      this.z / len,
      this.w / len
    );
  }

  /**
   * Calculates the dot product with another quaternion.
   */
  dot(q: Quaternion): number {
    return this.x * q.x + this.y * q.y + this.z * q.z + this.w * q.w;
  }

  /**
   * Rotates a vector by this quaternion.
   */
  rotateVector(v: Vector3): Vector3 {
    const qv = new Quaternion(v.x, v.y, v.z, 0);
    const result = this.multiply(qv).multiply(this.conjugate());
    return new Vector3(result.x, result.y, result.z);
  }

  /**
   * Spherical linear interpolation between this quaternion and another.
   * @param q - Target quaternion
   * @param t - Interpolation factor (0-1)
   */
  slerp(q: Quaternion, t: number): Quaternion {
    let dot = this.dot(q);
    
    // If the dot product is negative, negate one quaternion
    // to take the shorter path
    let q1 = q;
    if (dot < 0) {
      dot = -dot;
      q1 = new Quaternion(-q.x, -q.y, -q.z, -q.w);
    }

    // If quaternions are very close, use linear interpolation
    if (dot > 0.9995) {
      return new Quaternion(
        this.x + (q1.x - this.x) * t,
        this.y + (q1.y - this.y) * t,
        this.z + (q1.z - this.z) * t,
        this.w + (q1.w - this.w) * t
      ).normalize();
    }

    // Calculate angle between quaternions
    const theta = Math.acos(dot);
    const sinTheta = Math.sin(theta);
    const wa = Math.sin((1 - t) * theta) / sinTheta;
    const wb = Math.sin(t * theta) / sinTheta;

    return new Quaternion(
      this.x * wa + q1.x * wb,
      this.y * wa + q1.y * wb,
      this.z * wa + q1.z * wb,
      this.w * wa + q1.w * wb
    );
  }

  /**
   * Checks if this quaternion equals another quaternion.
   */
  equals(q: Quaternion, epsilon: number = 0.000001): boolean {
    return (
      Math.abs(this.x - q.x) < epsilon &&
      Math.abs(this.y - q.y) < epsilon &&
      Math.abs(this.z - q.z) < epsilon &&
      Math.abs(this.w - q.w) < epsilon
    );
  }

  /**
   * Returns a string representation of this quaternion.
   */
  toString(): string {
    return `Quaternion(${this.x.toFixed(3)}, ${this.y.toFixed(3)}, ${this.z.toFixed(3)}, ${this.w.toFixed(3)})`;
  }

  /**
   * Converts to array [x, y, z, w].
   */
  toArray(): [number, number, number, number] {
    return [this.x, this.y, this.z, this.w];
  }

  /**
   * Creates a Quaternion from an array.
   */
  static fromArray(arr: number[]): Quaternion {
    return new Quaternion(arr[0] || 0, arr[1] || 0, arr[2] || 0, arr[3] || 1);
  }

  /**
   * Creates an identity quaternion (no rotation).
   */
  static identity(): Quaternion {
    return new Quaternion(0, 0, 0, 1);
  }

  /**
   * Creates a quaternion from Euler angles (in radians).
   * Order: YXZ (yaw, pitch, roll)
   */
  static fromEuler(pitch: number, yaw: number, roll: number): Quaternion {
    const cy = Math.cos(yaw * 0.5);
    const sy = Math.sin(yaw * 0.5);
    const cp = Math.cos(pitch * 0.5);
    const sp = Math.sin(pitch * 0.5);
    const cr = Math.cos(roll * 0.5);
    const sr = Math.sin(roll * 0.5);

    return new Quaternion(
      sr * cp * cy - cr * sp * sy,
      cr * sp * cy + sr * cp * sy,
      cr * cp * sy - sr * sp * cy,
      cr * cp * cy + sr * sp * sy
    );
  }

  /**
   * Creates a quaternion from an axis and angle.
   * @param axis - Normalized rotation axis
   * @param angle - Rotation angle in radians
   */
  static fromAxisAngle(axis: Vector3, angle: number): Quaternion {
    const halfAngle = angle * 0.5;
    const s = Math.sin(halfAngle);
    return new Quaternion(
      axis.x * s,
      axis.y * s,
      axis.z * s,
      Math.cos(halfAngle)
    );
  }

  /**
   * Creates a quaternion that rotates from one vector to another.
   */
  static fromVectorToVector(from: Vector3, to: Vector3): Quaternion {
    const fromNorm = from.normalize();
    const toNorm = to.normalize();
    const dot = fromNorm.dot(toNorm);

    // Vectors are parallel
    if (dot > 0.999999) {
      return Quaternion.identity();
    }

    // Vectors are opposite
    if (dot < -0.999999) {
      // Find an arbitrary perpendicular axis
      let axis = Vector3.unitX().cross(fromNorm);
      if (axis.lengthSquared() < 0.000001) {
        axis = Vector3.unitY().cross(fromNorm);
      }
      return Quaternion.fromAxisAngle(axis.normalize(), Math.PI);
    }

    const axis = fromNorm.cross(toNorm);
    const w = Math.sqrt(fromNorm.lengthSquared() * toNorm.lengthSquared()) + dot;
    return new Quaternion(axis.x, axis.y, axis.z, w).normalize();
  }

  /**
   * Converts this quaternion to Euler angles (in radians).
   * Returns [pitch, yaw, roll]
   */
  toEuler(): [number, number, number] {
    // Roll (x-axis rotation)
    const sinr_cosp = 2 * (this.w * this.x + this.y * this.z);
    const cosr_cosp = 1 - 2 * (this.x * this.x + this.y * this.y);
    const roll = Math.atan2(sinr_cosp, cosr_cosp);

    // Pitch (y-axis rotation)
    const sinp = 2 * (this.w * this.y - this.z * this.x);
    let pitch: number;
    if (Math.abs(sinp) >= 1) {
      pitch = Math.sign(sinp) * Math.PI / 2; // Use 90 degrees if out of range
    } else {
      pitch = Math.asin(sinp);
    }

    // Yaw (z-axis rotation)
    const siny_cosp = 2 * (this.w * this.z + this.x * this.y);
    const cosy_cosp = 1 - 2 * (this.y * this.y + this.z * this.z);
    const yaw = Math.atan2(siny_cosp, cosy_cosp);

    return [pitch, yaw, roll];
  }
}
