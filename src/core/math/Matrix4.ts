import { Vector3 } from './Vector3';
import { Quaternion } from './Quaternion';

/**
 * 4x4 Matrix implementation for 3D transformations.
 * Column-major order for compatibility with WebGL/OpenGL.
 */
export class Matrix4 {
  // 16 elements in column-major order
  public elements: Float32Array;

  constructor() {
    this.elements = new Float32Array(16);
    this.identity();
  }

  /**
   * Sets this matrix to the identity matrix.
   */
  identity(): Matrix4 {
    const e = this.elements;
    e[0] = 1; e[4] = 0; e[8] = 0;  e[12] = 0;
    e[1] = 0; e[5] = 1; e[9] = 0;  e[13] = 0;
    e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
    e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
    return this;
  }

  /**
   * Copies values from another matrix.
   */
  copy(m: Matrix4): Matrix4 {
    this.elements.set(m.elements);
    return this;
  }

  /**
   * Creates a new Matrix4 with the same values as this one.
   */
  clone(): Matrix4 {
    const m = new Matrix4();
    m.copy(this);
    return m;
  }

  /**
   * Multiplies this matrix by another matrix.
   */
  multiply(m: Matrix4): Matrix4 {
    const result = new Matrix4();
    const a = this.elements;
    const b = m.elements;
    const r = result.elements;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        let sum = 0;
        for (let k = 0; k < 4; k++) {
          sum += a[i + k * 4] * b[k + j * 4];
        }
        r[i + j * 4] = sum;
      }
    }

    return result;
  }

  /**
   * Sets this matrix to a translation matrix.
   */
  makeTranslation(x: number, y: number, z: number): Matrix4 {
    this.identity();
    this.elements[12] = x;
    this.elements[13] = y;
    this.elements[14] = z;
    return this;
  }

  /**
   * Sets this matrix to a rotation matrix from a quaternion.
   */
  makeRotationFromQuaternion(q: Quaternion): Matrix4 {
    const e = this.elements;
    const x = q.x, y = q.y, z = q.z, w = q.w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    e[0] = 1 - (yy + zz);
    e[1] = xy + wz;
    e[2] = xz - wy;
    e[3] = 0;

    e[4] = xy - wz;
    e[5] = 1 - (xx + zz);
    e[6] = yz + wx;
    e[7] = 0;

    e[8] = xz + wy;
    e[9] = yz - wx;
    e[10] = 1 - (xx + yy);
    e[11] = 0;

    e[12] = 0;
    e[13] = 0;
    e[14] = 0;
    e[15] = 1;

    return this;
  }

  /**
   * Sets this matrix to a scale matrix.
   */
  makeScale(x: number, y: number, z: number): Matrix4 {
    this.identity();
    this.elements[0] = x;
    this.elements[5] = y;
    this.elements[10] = z;
    return this;
  }

  /**
   * Composes this matrix from position, quaternion, and scale.
   */
  compose(position: Vector3, quaternion: Quaternion, scale: Vector3): Matrix4 {
    const e = this.elements;

    // Rotation from quaternion
    const x = quaternion.x, y = quaternion.y, z = quaternion.z, w = quaternion.w;
    const x2 = x + x, y2 = y + y, z2 = z + z;
    const xx = x * x2, xy = x * y2, xz = x * z2;
    const yy = y * y2, yz = y * z2, zz = z * z2;
    const wx = w * x2, wy = w * y2, wz = w * z2;

    e[0] = (1 - (yy + zz)) * scale.x;
    e[1] = (xy + wz) * scale.x;
    e[2] = (xz - wy) * scale.x;
    e[3] = 0;

    e[4] = (xy - wz) * scale.y;
    e[5] = (1 - (xx + zz)) * scale.y;
    e[6] = (yz + wx) * scale.y;
    e[7] = 0;

    e[8] = (xz + wy) * scale.z;
    e[9] = (yz - wx) * scale.z;
    e[10] = (1 - (xx + yy)) * scale.z;
    e[11] = 0;

    e[12] = position.x;
    e[13] = position.y;
    e[14] = position.z;
    e[15] = 1;

    return this;
  }

  /**
   * Decomposes this matrix into position, quaternion, and scale.
   */
  decompose(): { position: Vector3; rotation: Quaternion; scale: Vector3 } {
    const e = this.elements;
    
    // Extract position
    const position = new Vector3(e[12], e[13], e[14]);

    // Extract scale
    const sx = Math.sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2]);
    const sy = Math.sqrt(e[4] * e[4] + e[5] * e[5] + e[6] * e[6]);
    const sz = Math.sqrt(e[8] * e[8] + e[9] * e[9] + e[10] * e[10]);
    const scale = new Vector3(sx, sy, sz);

    // Extract rotation
    const invSx = 1 / sx;
    const invSy = 1 / sy;
    const invSz = 1 / sz;

    const m11 = e[0] * invSx, m12 = e[4] * invSy, m13 = e[8] * invSz;
    const m21 = e[1] * invSx, m22 = e[5] * invSy, m23 = e[9] * invSz;
    const m31 = e[2] * invSx, m32 = e[6] * invSy, m33 = e[10] * invSz;

    const trace = m11 + m22 + m33;
    let rotation: Quaternion;

    if (trace > 0) {
      const s = 0.5 / Math.sqrt(trace + 1.0);
      rotation = new Quaternion(
        (m32 - m23) * s,
        (m13 - m31) * s,
        (m21 - m12) * s,
        0.25 / s
      );
    } else if (m11 > m22 && m11 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
      rotation = new Quaternion(
        0.25 * s,
        (m12 + m21) / s,
        (m13 + m31) / s,
        (m32 - m23) / s
      );
    } else if (m22 > m33) {
      const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
      rotation = new Quaternion(
        (m12 + m21) / s,
        0.25 * s,
        (m23 + m32) / s,
        (m13 - m31) / s
      );
    } else {
      const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
      rotation = new Quaternion(
        (m13 + m31) / s,
        (m23 + m32) / s,
        0.25 * s,
        (m21 - m12) / s
      );
    }

    return { position, rotation, scale };
  }

  /**
   * Transforms a Vector3 by this matrix.
   */
  transformVector3(v: Vector3): Vector3 {
    const e = this.elements;
    const x = v.x, y = v.y, z = v.z;
    const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

    return new Vector3(
      (e[0] * x + e[4] * y + e[8] * z + e[12]) * w,
      (e[1] * x + e[5] * y + e[9] * z + e[13]) * w,
      (e[2] * x + e[6] * y + e[10] * z + e[14]) * w
    );
  }

  /**
   * Sets this matrix to a perspective projection matrix.
   */
  makePerspective(
    fov: number,
    aspect: number,
    near: number,
    far: number
  ): Matrix4 {
    const f = 1.0 / Math.tan(fov / 2);
    const rangeInv = 1 / (near - far);

    const e = this.elements;
    e[0] = f / aspect;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = f;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = (far + near) * rangeInv;
    e[11] = -1;

    e[12] = 0;
    e[13] = 0;
    e[14] = far * near * rangeInv * 2;
    e[15] = 0;

    return this;
  }

  /**
   * Sets this matrix to an orthographic projection matrix.
   */
  makeOrthographic(
    left: number,
    right: number,
    top: number,
    bottom: number,
    near: number,
    far: number
  ): Matrix4 {
    const w = 1 / (right - left);
    const h = 1 / (top - bottom);
    const p = 1 / (far - near);

    const e = this.elements;
    e[0] = 2 * w;
    e[1] = 0;
    e[2] = 0;
    e[3] = 0;

    e[4] = 0;
    e[5] = 2 * h;
    e[6] = 0;
    e[7] = 0;

    e[8] = 0;
    e[9] = 0;
    e[10] = -2 * p;
    e[11] = 0;

    e[12] = -(right + left) * w;
    e[13] = -(top + bottom) * h;
    e[14] = -(far + near) * p;
    e[15] = 1;

    return this;
  }

  /**
   * Inverts this matrix.
   */
  invert(): Matrix4 | null {
    const e = this.elements;
    const result = new Matrix4();
    const r = result.elements;

    const n11 = e[0], n21 = e[1], n31 = e[2], n41 = e[3];
    const n12 = e[4], n22 = e[5], n32 = e[6], n42 = e[7];
    const n13 = e[8], n23 = e[9], n33 = e[10], n43 = e[11];
    const n14 = e[12], n24 = e[13], n34 = e[14], n44 = e[15];

    const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

    const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

    if (det === 0) return null;

    const detInv = 1 / det;

    r[0] = t11 * detInv;
    r[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
    r[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
    r[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;

    r[4] = t12 * detInv;
    r[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
    r[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
    r[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;

    r[8] = t13 * detInv;
    r[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
    r[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
    r[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;

    r[12] = t14 * detInv;
    r[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
    r[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
    r[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;

    return result;
  }

  /**
   * Returns array representation of this matrix.
   */
  toArray(): number[] {
    return Array.from(this.elements);
  }

  /**
   * Returns a string representation of this matrix.
   */
  toString(): string {
    const e = this.elements;
    return `Matrix4(
  ${e[0].toFixed(3)}, ${e[4].toFixed(3)}, ${e[8].toFixed(3)}, ${e[12].toFixed(3)},
  ${e[1].toFixed(3)}, ${e[5].toFixed(3)}, ${e[9].toFixed(3)}, ${e[13].toFixed(3)},
  ${e[2].toFixed(3)}, ${e[6].toFixed(3)}, ${e[10].toFixed(3)}, ${e[14].toFixed(3)},
  ${e[3].toFixed(3)}, ${e[7].toFixed(3)}, ${e[11].toFixed(3)}, ${e[15].toFixed(3)}
)`;
  }
}
