import { Request, Response } from "express";
import User from "../models/user.model";
import { Group } from "../models/group.model";
import { IRequest } from "../interfaces/user.interface";

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description, createdBy, members } = req.body;

    // Check if the user already created a group with the same name
    const existingGroup = await Group.findOne({ name, createdBy });

    if (existingGroup) {
      res
        .status(400)
        .json({ message: "Group with this name already exists for this user" });
      return;
    }

    // Create group
    const group = new Group({
      name,
      description,
      createdBy,
      members: [createdBy, ...members],
    });
    await group.save();

    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getUserGroups = async (req: IRequest, res: Response) => {
  try {
    const userId = req?.user?.id as string; // Extract user ID from the authenticated request
    console.log(userId, "userId");

    // Find all groups where the user is a member
    const groups = await Group.find({ members: userId });

    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
