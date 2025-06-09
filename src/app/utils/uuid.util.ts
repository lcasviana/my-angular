import { v7, validate } from "uuid";

/**
 * A class representing a UUID with its base64 representation.
 * Provides methods to generate, validate, and convert between UUID and base64 formats.
 */
export class Uuid {
  public readonly uuid: string;
  public readonly base64: string;

  private constructor(uuid: string | null = null, base64: string | null = null) {
    if (uuid) {
      this.uuid = uuid;
      this.base64 = this.uuid_to_base64(uuid);
      if (!validate(this.uuid)) throw new Error("Invalid UUID format");
    } else if (base64) {
      if (!this.isValidBase64(base64)) throw new Error("Invalid base64 format");
      this.base64 = base64;
      this.uuid = Uuid.base64_to_uuid(base64);
      if (!validate(this.uuid)) throw new Error("Invalid UUID generated from base64");
    } else {
      this.uuid = v7();
      this.base64 = this.uuid_to_base64(this.uuid);
    }
  }

  /**
   * Generates a new UUID using UUID v7 (time-based)
   */
  public static generate(): Uuid {
    return new Uuid();
  }

  /**
   * Creates a Uuid instance from an existing UUID string
   * @throws Error if the UUID is invalid
   */
  public static fromUuid(uuid: string): Uuid {
    return new Uuid(uuid);
  }

  /**
   * Creates a Uuid instance from a base64 string
   * @throws Error if the base64 is invalid or generates an invalid UUID
   */
  public static fromBase64(base64: string): Uuid {
    return new Uuid(null, base64);
  }

  /**
   * Converts a base64 string to UUID format
   * @throws Error if the base64 string is invalid
   */
  private static base64_to_uuid(base64: string): string {
    try {
      const hex = atob(base64.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");

      return `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(12, 16)}-${hex.substring(16, 20)}-${hex.substring(20)}`;
    } catch {
      throw new Error("Invalid base64 format");
    }
  }

  /**
   * Converts a UUID to base64 format
   */
  private uuid_to_base64(uuid: string): string {
    const hex = uuid.replace(/-/g, "");
    const bytes = hex.match(/.{2}/g)?.map((byte) => parseInt(byte, 16)) || [];
    const base64 = btoa(String.fromCharCode(...bytes));
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  /**
   * Validates if a string is a valid base64 format
   */
  private isValidBase64(str: string): boolean {
    try {
      return /^[A-Za-z0-9\-_]+$/.test(str);
    } catch {
      return false;
    }
  }

  /**
   * Returns a string representation of the UUID
   */
  public toString(): string {
    return this.uuid;
  }
}
