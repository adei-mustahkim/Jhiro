import { describe, expect, it } from "vitest";
import { createClientSchema, updateClientSchema } from "@/lib/validators/client";
import { leadSchema } from "@/lib/validators/lead";
import { createProjectSchema, projectQuerySchema, updateProjectSchema } from "@/lib/validators/project";
import { createInvoiceSchema } from "@/lib/validators/invoice";

describe("input validators", () => {
  it("normalizes client email", () => {
    const result = createClientSchema.parse({ name:"Budi Santoso", email:"BUDI@EXAMPLE.COM", password:"Jh!ClientBaru7", companyName:"Ruang Tumbuh" });
    expect(result.email).toBe("budi@example.com");
  });

  it("requires a secure temporary client password", () => {
    expect(() => createClientSchema.parse({ name:"Budi Santoso", email:"budi@example.com", password:"pendek", companyName:"Ruang Tumbuh" })).toThrow();
  });

  it("validates client profile and access updates", () => {
    const result = updateClientSchema.parse({ name:"Budi Santoso", email:"BUDI@EXAMPLE.COM", companyName:"Ruang Tumbuh", isActive:false });
    expect(result).toMatchObject({ email:"budi@example.com", isActive:false });
  });

  it("rejects an invalid lead", () => {
    expect(() => leadSchema.parse({ name:"A", email:"salah", message:"pendek" })).toThrow();
  });

  it("accepts a complete lead", () => {
    const result = leadSchema.parse({ name:"Ayu Pratama", email:"ayu@example.com", message:"Kami membutuhkan dashboard operasional." });
    expect(result.name).toBe("Ayu Pratama");
  });

  it("coerces and limits project pagination", () => {
    expect(projectQuerySchema.parse({ page:"2", pageSize:"25" })).toMatchObject({ page:2, pageSize:25 });
    expect(() => projectQuerySchema.parse({ page:"0", pageSize:"101" })).toThrow();
  });

  it("rejects project input without valid client id", () => {
    expect(() => createProjectSchema.parse({ name:"Portal baru", clientId:"invalid" })).toThrow();
  });

  it("enforces progress boundaries", () => {
    expect(updateProjectSchema.parse({ progress:76 }).progress).toBe(76);
    expect(() => updateProjectSchema.parse({ progress:101 })).toThrow();
  });

  it("validates invoice amount and due date", () => {
    const result = createInvoiceSchema.parse({ clientId:"550e8400-e29b-41d4-a716-446655440000", amount:"15000000", description:"Termin pertama", dueDate:"2026-07-01" });
    expect(result.amount).toBe(15000000);
    expect(result.description).toBe("Termin pertama");
    expect(() => createInvoiceSchema.parse({ clientId:"invalid", amount:0, dueDate:"invalid" })).toThrow();
  });
});
