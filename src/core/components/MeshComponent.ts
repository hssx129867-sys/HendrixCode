import { IComponent } from '../ecs/Component';
import { Vector3 } from '../math/Vector3';

/**
 * MeshComponent represents a 3D model for rendering.
 */
export class MeshComponent implements IComponent {
  readonly type: string = 'mesh';

  constructor(
    public modelId: string,
    public materialId: string = 'default',
    public visible: boolean = true,
    public castShadows: boolean = true,
    public receiveShadows: boolean = true
  ) {}
}

/**
 * Simple shape types for basic geometry.
 */
export enum ShapeType {
  CUBE = 'cube',
  SPHERE = 'sphere',
  PLANE = 'plane',
  CYLINDER = 'cylinder',
  CONE = 'cone',
}

/**
 * PrimitiveShapeComponent for rendering basic geometric shapes.
 */
export class PrimitiveShapeComponent implements IComponent {
  readonly type: string = 'primitiveShape';

  constructor(
    public shapeType: ShapeType = ShapeType.CUBE,
    public color: string = '#ffffff',
    public size: Vector3 = new Vector3(1, 1, 1)
  ) {}
}
