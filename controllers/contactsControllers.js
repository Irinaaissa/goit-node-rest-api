import Contact from "../models/contact.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
    res.status(200).json(contacts);
  } catch (error) {
    next(HttpError(500));
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById({ _id: id, owner: req.user.id });

    if (contact === null) {
      throw HttpError(404);
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedContact = await Contact.findByIdAndDelete({ _id: id, owner: req.user.id });
    if (deletedContact === null) {
      throw HttpError(404);
    }

    res.status(200).json(deletedContact);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      favorite: req.body.favorite,
      owner: req.user.id,
    };

    const newContact = await Contact.create(contact);
    if (newContact === null) {
      throw HttpError(404);
    }
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw HttpError(404);
    }

    const { id } = req.params;
    const newContactInfo = {
      ...req.body,
    };
    const updatedContact = await Contact.findByIdAndUpdate({ _id: id, owner: req.user.id }, newContactInfo, {
      new: true,
    });

    if (updatedContact === null) {
      throw HttpError(404);
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    const newContactInfo = {
      ...req.body,
    };
    const updatedContact = await Contact.findByIdAndUpdate({ _id: id, owner: req.user.id }, newContactInfo, {
      new: true,
    });

    if (updatedContact === null) {
      throw HttpError(404);
    }
    res.status(200).json(updatedContact);
  } catch (error) {
    next(error);
  }
};