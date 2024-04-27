import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} from "../controllers/contactsControllers.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";


const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema));

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema));

contactsRouter.put("/:id", updateContact);

export default contactsRouter;