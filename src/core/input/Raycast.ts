import { Vector3 } from '../math/Vector3';
import { Vector2 } from '../math/Vector2';

/**
 * Ray for raycasting in 3D space.
 */
export class Ray {
  constructor(
    public origin: Vector3,
    public direction: Vector3
  ) {
    this.direction = direction.normalize();
  }

  /**
   * Gets a point along the ray at distance t.
   */
  at(t: number): Vector3 {
    return this.origin.add(this.direction.multiplyScalar(t));
  }

  /**
   * Tests intersection with a sphere.
   */
  intersectSphere(center: Vector3, radius: number): number | null {
    const oc = this.origin.subtract(center);
    const a = this.direction.dot(this.direction);
    const b = 2.0 * oc.dot(this.direction);
    const c = oc.dot(oc) - radius * radius;
    const discriminant = b * b - 4 * a * c;

    if (discriminant < 0) {
      return null;
    }

    const t = (-b - Math.sqrt(discriminant)) / (2.0 * a);
    return t > 0 ? t : null;
  }

  /**
   * Tests intersection with a plane.
   */
  intersectPlane(planePoint: Vector3, planeNormal: Vector3): number | null {
    const denom = planeNormal.dot(this.direction);
    
    if (Math.abs(denom) < 0.000001) {
      return null; // Parallel to plane
    }

    const t = planePoint.subtract(this.origin).dot(planeNormal) / denom;
    return t >= 0 ? t : null;
  }

  /**
   * Tests intersection with an axis-aligned bounding box.
   */
  intersectAABB(min: Vector3, max: Vector3): number | null {
    let tmin = (min.x - this.origin.x) / this.direction.x;
    let tmax = (max.x - this.origin.x) / this.direction.x;

    if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

    let tymin = (min.y - this.origin.y) / this.direction.y;
    let tymax = (max.y - this.origin.y) / this.direction.y;

    if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

    if (tmin > tymax || tymin > tmax) return null;

    if (tymin > tmin) tmin = tymin;
    if (tymax < tmax) tmax = tymax;

    let tzmin = (min.z - this.origin.z) / this.direction.z;
    let tzmax = (max.z - this.origin.z) / this.direction.z;

    if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

    if (tmin > tzmax || tzmin > tmax) return null;

    if (tzmin > tmin) tmin = tzmin;

    return tmin >= 0 ? tmin : null;
  }
}

/**
 * Raycast hit result.
 */
export interface RaycastHit {
  point: Vector3;
  distance: number;
  normal: Vector3;
  entity?: number;
}

/**
 * Raycast utility for 3D picking and collision detection.
 */
export class Raycast {
  /**
   * Creates a ray from screen coordinates.
   * @param screenPos - Screen position (0,0 = top-left)
   * @param screenWidth - Screen width in pixels
   * @param screenHeight - Screen height in pixels
   * @param cameraPos - Camera world position
   * @param cameraDirection - Camera forward direction
   * @param fov - Camera field of view in radians
   */
  static screenPointToRay(
    screenPos: Vector2,
    screenWidth: number,
    screenHeight: number,
    cameraPos: Vector3,
    cameraDirection: Vector3,
    fov: number = Math.PI / 3 // 60 degrees default
  ): Ray {
    // Convert screen coordinates to NDC (-1 to 1)
    const x = (2.0 * screenPos.x) / screenWidth - 1.0;
    const y = 1.0 - (2.0 * screenPos.y) / screenHeight;

    // Calculate ray direction based on FOV
    const aspect = screenWidth / screenHeight;
    const tanHalfFov = Math.tan(fov / 2);

    // Assuming camera looks down -Z, with Y up and X right
    const cameraRight = cameraDirection.cross(Vector3.up()).normalize();
    const cameraUp = cameraRight.cross(cameraDirection).normalize();

    const direction = cameraDirection
      .add(cameraRight.multiplyScalar(x * aspect * tanHalfFov))
      .add(cameraUp.multiplyScalar(y * tanHalfFov))
      .normalize();

    return new Ray(cameraPos, direction);
  }

  /**
   * Performs a raycast against multiple objects.
   * Returns the closest hit, or null if no hit.
   */
  static cast(
    ray: Ray,
    objects: Array<{ center: Vector3; radius: number; entity?: number }>
  ): RaycastHit | null {
    let closestHit: RaycastHit | null = null;
    let closestDistance = Infinity;

    for (const obj of objects) {
      const t = ray.intersectSphere(obj.center, obj.radius);
      if (t !== null && t < closestDistance) {
        const point = ray.at(t);
        const normal = point.subtract(obj.center).normalize();
        
        closestHit = {
          point,
          distance: t,
          normal,
          entity: obj.entity,
        };
        closestDistance = t;
      }
    }

    return closestHit;
  }

  /**
   * Checks if a ray intersects a sphere.
   */
  static raySphereIntersection(
    ray: Ray,
    center: Vector3,
    radius: number
  ): boolean {
    return ray.intersectSphere(center, radius) !== null;
  }

  /**
   * Checks if a ray intersects a plane.
   */
  static rayPlaneIntersection(
    ray: Ray,
    planePoint: Vector3,
    planeNormal: Vector3
  ): Vector3 | null {
    const t = ray.intersectPlane(planePoint, planeNormal);
    return t !== null ? ray.at(t) : null;
  }
}
