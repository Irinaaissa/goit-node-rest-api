import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createContactSchema,
  updateContactSchema,
  contactSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema));

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema));

contactsRouter.put("/:id", updateContact);

contactsRouter.patch("/:id/favorite", validateBody(contactSchema));

contactsRouter.patch("/:id/favorite", updateStatusContact);


export default contactsRouter;