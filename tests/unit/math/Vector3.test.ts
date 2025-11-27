import { describe, it, expect } from 'vitest';
import { Vector3 } from '../../../src/core/math/Vector3';

describe('Vector3', () => {
  describe('constructor', () => {
    it('should create vector with default values', () => {
      const v = new Vector3();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('should create vector with provided values', () => {
      const v = new Vector3(1, 2, 3);
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
      expect(v.z).toBe(3);
    });
  });

  describe('add', () => {
    it('should add two vectors correctly', () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      const result = a.add(b);
      expect(result.x).toBe(5);
      expect(result.y).toBe(7);
      expect(result.z).toBe(9);
    });
  });

  describe('subtract', () => {
    it('should subtract two vectors correctly', () => {
      const a = new Vector3(5, 7, 9);
      const b = new Vector3(1, 2, 3);
      const result = a.subtract(b);
      expect(result.x).toBe(4);
      expect(result.y).toBe(5);
      expect(result.z).toBe(6);
    });
  });

  describe('multiplyScalar', () => {
    it('should multiply vector by scalar correctly', () => {
      const v = new Vector3(1, 2, 3);
      const result = v.multiplyScalar(2);
      expect(result.x).toBe(2);
      expect(result.y).toBe(4);
      expect(result.z).toBe(6);
    });
  });

  describe('dot', () => {
    it('should calculate dot product correctly', () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(4, 5, 6);
      const result = a.dot(b);
      expect(result).toBe(32); // 1*4 + 2*5 + 3*6
    });
  });

  describe('cross', () => {
    it('should calculate cross product correctly', () => {
      const a = new Vector3(1, 0, 0);
      const b = new Vector3(0, 1, 0);
      const result = a.cross(b);
      expect(result.x).toBe(0);
      expect(result.y).toBe(0);
      expect(result.z).toBe(1);
    });
  });

  describe('length', () => {
    it('should calculate length correctly', () => {
      const v = new Vector3(3, 4, 0);
      expect(v.length()).toBe(5);
    });

    it('should calculate length for 3D vector', () => {
      const v = new Vector3(1, 2, 2);
      expect(v.length()).toBe(3);
    });
  });

  describe('normalize', () => {
    it('should normalize vector to unit length', () => {
      const v = new Vector3(3, 4, 0);
      const normalized = v.normalize();
      expect(normalized.length()).toBeCloseTo(1);
      expect(normalized.x).toBeCloseTo(0.6);
      expect(normalized.y).toBeCloseTo(0.8);
    });

    it('should return zero vector for zero input', () => {
      const v = new Vector3(0, 0, 0);
      const normalized = v.normalize();
      expect(normalized.x).toBe(0);
      expect(normalized.y).toBe(0);
      expect(normalized.z).toBe(0);
    });
  });

  describe('distanceTo', () => {
    it('should calculate distance between two points', () => {
      const a = new Vector3(0, 0, 0);
      const b = new Vector3(3, 4, 0);
      expect(a.distanceTo(b)).toBe(5);
    });
  });

  describe('lerp', () => {
    it('should interpolate between vectors', () => {
      const a = new Vector3(0, 0, 0);
      const b = new Vector3(10, 10, 10);
      const mid = a.lerp(b, 0.5);
      expect(mid.x).toBe(5);
      expect(mid.y).toBe(5);
      expect(mid.z).toBe(5);
    });

    it('should return start vector at t=0', () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(10, 20, 30);
      const result = a.lerp(b, 0);
      expect(result.x).toBe(1);
      expect(result.y).toBe(2);
      expect(result.z).toBe(3);
    });

    it('should return end vector at t=1', () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(10, 20, 30);
      const result = a.lerp(b, 1);
      expect(result.x).toBe(10);
      expect(result.y).toBe(20);
      expect(result.z).toBe(30);
    });
  });

  describe('static methods', () => {
    it('should create zero vector', () => {
      const v = Vector3.zero();
      expect(v.x).toBe(0);
      expect(v.y).toBe(0);
      expect(v.z).toBe(0);
    });

    it('should create unit vectors', () => {
      const x = Vector3.unitX();
      const y = Vector3.unitY();
      const z = Vector3.unitZ();
      
      expect(x.x).toBe(1);
      expect(y.y).toBe(1);
      expect(z.z).toBe(1);
    });

    it('should create direction vectors', () => {
      const up = Vector3.up();
      const forward = Vector3.forward();
      const right = Vector3.right();

      expect(up.y).toBe(1);
      expect(forward.z).toBe(-1);
      expect(right.x).toBe(1);
    });
  });

  describe('equals', () => {
    it('should return true for equal vectors', () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(1, 2, 3);
      expect(a.equals(b)).toBe(true);
    });

    it('should return false for different vectors', () => {
      const a = new Vector3(1, 2, 3);
      const b = new Vector3(1, 2, 4);
      expect(a.equals(b)).toBe(false);
    });
  });
});
