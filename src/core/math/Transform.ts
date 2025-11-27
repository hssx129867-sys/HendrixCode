import { Vector3 } from './Vector3';
import { Quaternion } from './Quaternion';
import { Matrix4 } from './Matrix4';

/**
 * Transform represents position, rotation, and scale in 3D space.
 * Provides convenient methods for common transformation operations.
 */
export class Transform {
  public position: Vector3;
  public rotation: Quaternion;
  public scale: Vector3;

  constructor(
    position: Vector3 = new Vector3(),
    rotation: Quaternion = Quaternion.identity(),
    scale: Vector3 = new Vector3(1, 1, 1)
  ) {
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }

  /**
   * Creates a new Transform with the same values as this one.
   */
  clone(): Transform {
    return new Transform(
      this.position.clone(),
      this.rotation.clone(),
      this.scale.clone()
    );
  }

  /**
   * Copies values from another transform.
   */
  copy(t: Transform): Transform {
    this.position.copy(t.position);
    this.rotation.copy(t.rotation);
    this.scale.copy(t.scale);
    return this;
  }

  /**
   * Converts this transform to a 4x4 transformation matrix.
   */
  toMatrix(): Matrix4 {
    const matrix = new Matrix4();
    matrix.compose(this.position, this.rotation, this.scale);
    return matrix;
  }

  /**
   * Sets this transform from a 4x4 transformation matrix.
   */
  fromMatrix(matrix: Matrix4): Transform {
    const decomposed = matrix.decompose();
    this.position.copy(decomposed.position);
    this.rotation.copy(decomposed.rotation);
    this.scale.copy(decomposed.scale);
    return this;
  }

  /**
   * Gets the forward direction vector (local Z axis).
   */
  getForward(): Vector3 {
    return this.rotation.rotateVector(Vector3.forward());
  }

  /**
   * Gets the up direction vector (local Y axis).
   */
  getUp(): Vector3 {
    return this.rotation.rotateVector(Vector3.up());
  }

  /**
   * Gets the right direction vector (local X axis).
   */
  getRight(): Vector3 {
    return this.rotation.rotateVector(Vector3.right());
  }

  /**
   * Rotates to look at a target position.
   * @param target - Position to look at
   * @param up - Up vector (default: world up)
   */
  lookAt(target: Vector3, up: Vector3 = Vector3.up()): Transform {
    const forward = target.subtract(this.position).normalize();
    const right = forward.cross(up).normalize();
    const newUp = right.cross(forward).normalize();

    // Build rotation matrix from basis vectors
    const matrix = new Matrix4();
    const e = matrix.elements;
    e[0] = right.x;
    e[1] = right.y;
    e[2] = right.z;
    e[4] = newUp.x;
    e[5] = newUp.y;
    e[6] = newUp.z;
    e[8] = -forward.x;
    e[9] = -forward.y;
    e[10] = -forward.z;

    const decomposed = matrix.decompose();
    this.rotation.copy(decomposed.rotation);

    return this;
  }

  /**
   * Translates by a vector in world space.
   */
  translate(v: Vector3): Transform {
    this.position = this.position.add(v);
    return this;
  }

  /**
   * Translates by a vector in local space.
   */
  translateLocal(v: Vector3): Transform {
    const worldV = this.rotation.rotateVector(v);
    this.position = this.position.add(worldV);
    return this;
  }

  /**
   * Rotates by a quaternion.
   */
  rotate(q: Quaternion): Transform {
    this.rotation = this.rotation.multiply(q);
    return this;
  }

  /**
   * Rotates around an axis by an angle.
   * @param axis - Rotation axis (should be normalized)
   * @param angle - Rotation angle in radians
   */
  rotateAround(axis: Vector3, angle: number): Transform {
    const q = Quaternion.fromAxisAngle(axis, angle);
    this.rotation = this.rotation.multiply(q);
    return this;
  }

  /**
   * Scales uniformly.
   */
  scaleUniform(s: number): Transform {
    this.scale = this.scale.multiplyScalar(s);
    return this;
  }

  /**
   * Transforms a point from local space to world space.
   */
  transformPoint(point: Vector3): Vector3 {
    return this.toMatrix().transformVector3(point);
  }

  /**
   * Transforms a direction from local space to world space (ignores position and scale).
   */
  transformDirection(direction: Vector3): Vector3 {
    return this.rotation.rotateVector(direction);
  }

  /**
   * Linearly interpolates between this transform and another.
   * @param t - Target transform
   * @param alpha - Interpolation factor (0-1)
   */
  lerp(t: Transform, alpha: number): Transform {
    return new Transform(
      this.position.lerp(t.position, alpha),
      this.rotation.slerp(t.rotation, alpha),
      this.scale.lerp(t.scale, alpha)
    );
  }

  /**
   * Checks if this transform equals another transform.
   */
  equals(t: Transform, epsilon: number = 0.000001): boolean {
    return (
      this.position.equals(t.position, epsilon) &&
      this.rotation.equals(t.rotation, epsilon) &&
      this.scale.equals(t.scale, epsilon)
    );
  }

  /**
   * Returns a string representation of this transform.
   */
  toString(): string {
    return `Transform(
  position: ${this.position.toString()},
  rotation: ${this.rotation.toString()},
  scale: ${this.scale.toString()}
)`;
  }

  /**
   * Creates an identity transform (position at origin, no rotation, scale of 1).
   */
  static identity(): Transform {
    return new Transform(
      new Vector3(0, 0, 0),
      Quaternion.identity(),
      new Vector3(1, 1, 1)
    );
  }
}
