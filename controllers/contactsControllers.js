import HttpError from "../helpers/HttpError.js";
import contactsService from "../services/contactsServices.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await contactsService.listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500));
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const contact = await contactsService.getContactById(contactId);
    if (!contact) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
    const removeContact = await contactsService.removeContact(contactId);
    if (!removeContact) {
      throw HttpError(404);
    }
    res.status(200).json(removeContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.addContact(
      req.body.name,
      req.body.email,
      req.body.phone
    );

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contactId = req.params.id;
  const contactData = req.body;
  const updatedContact = await contactsService. updateContactById(contactId, contactData);
  if (!updatedContact) {
    throw HttpError(404);
  }
  res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};
