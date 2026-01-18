import db from "../../lib/prisma";
import { Property } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    if (req.method === "GET") {
      // Fetch properties (with optional search filter)
      const { search } = req.query;

      if (search && typeof search === "string") {
        const data: Property[] = await db.property.findMany({
          where: {
            location: {
              contains: search,
              mode: "insensitive",
            },
          },
          take: 50,
        });

        return res.status(200).json(data);
      }

      // If no search term, return all properties (limit for performance)
      const data: Property[] = await db.property.findMany({ take: 50 });
      return res.status(200).json(data);
    }

    if (req.method === "POST") {
      // Add a new property
      const propertyData: Omit<Property, "id" | "createdAt"> = req.body;
      const newProperty = await db.property.create({ data: propertyData });
      return res
        .status(201)
        .json({
          message: "Property added successfully!",
          property: newProperty,
        });
    }

    if (req.method === "PUT") {
      // Update an existing property
      const { id, ...property } = req.body;

      if (!id) {
        return res.status(400).json({ error: "Property ID is required" });
      }

      try {
        const updatedProperty = await db.property.update({
          where: { id: Number(id) },
          data: property,
        });

        return res
          .status(200)
          .json({
            message: "Property updated successfully!",
            property: updatedProperty,
          });
      } catch (error) {
        return res.status(404).json({ error: "Property not found" });
      }
    }

    if (req.method === "DELETE") {
      // Delete a property
      const id = req.query.id as string | undefined;

      if (!id) {
        return res.status(400).json({ error: "Property ID is required" });
      }

      try {
        await db.property.delete({
          where: { id: Number(id) },
        });

        return res
          .status(200)
          .json({ message: "Property deleted successfully!" });
      } catch (error) {
        return res.status(404).json({ error: "Property not found" });
      }
    }

    // Handle unsupported methods
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
