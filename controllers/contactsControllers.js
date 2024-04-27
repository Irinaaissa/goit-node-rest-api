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
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);
    if (!contact) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(HttpError(500));
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const removeContact = await contactsService.removeContact(id);
    if (!removeContact) {
      throw HttpError(404);
    }
    res.status(200).json(removeContact);
  } catch (error) {
    next(HttpError(500));
  }
};

export const createContact = async (req, res, next) => {
  try {
    const newContact = await contactsService.addContact({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    });

    res.status(201).json(newContact);
  } catch (error) {
    next(HttpError(500));
  }
};

export const updateContact = async(req, res,next) => {
    try {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                "message": "Body must have at least one field"
            })
        }
        const { id } = req.params;
        const contactData = req.body;
        const updatedContact = await contactsService.updateContactById(id, contactData);
        if (!updatedContact) {
          throw HttpError(404);
        }
        res.status(200).json(updatedContact);  
    } catch (error) {
        next(HttpError(500));
    }
};
