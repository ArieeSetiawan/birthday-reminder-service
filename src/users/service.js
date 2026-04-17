'use strict'

const { HttpError } = require('../lib/error')
const Users = require('./model');
const { scheduleBirthday } = require('../lib/birthday_calculator');
const agenda = require('../config/agenda');
const mongoose = require('mongoose');

class UserService {
    /**
     * Create a new user if email does not exist
     * @param {Object} data
     * @param {string} data.name  - User name
     * @param {string} data.email - Standard Email
     * @param {string} data.birthday - ISO 8601 date
     * @param {string} data.timezone - IANA timezone
     * @throws {HttpError} 400 if email already exists
     */
    async createUser(data) {
        const existUser = await this.getUserByEmail(data.email);
  
        if (existUser) {
          throw new HttpError(400, "Email Already Exists");
        }
  
      const user = await Users.create(data)
  
      await scheduleBirthday(user)
  
         return {
          id: user._id,
          name: user.name,
          email: user.email,
          birthday: user.birthday,
          timezone: user.timezone,
          created_at: user.createdAt
        };
    }

    /**
     * Get user by ID
     * @param {string} id - User ID
     * @throws {HttpError} 404 if user not found
     */
    async getUserById(id) {
      const user = await Users.findOne({
        _id: id,
        isDeleted: { $ne: true }
      });

      if (!user) {
        throw new HttpError(404, "User Not Found");
      }

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        birthday: user.birthday,
        timezone: user.timezone
      };
    }

    /**
     * Update user by ID
     * @param {string} id - User ID (MongoDB ObjectId)
     * @param {Object} data - Fields to update user
     * @param {string} [data.name] - User name
     * @param {string} [data.birthday] - ISO 8601 date
     * @param {string} [data.timezone] - IANA timezone
     * @throws {HttpError} 404 if user not found
     */
    async updateUser(id, data) {
      const user = await Users.findOneAndUpdate(
        { _id: id, isDeleted: { $ne: true } },
        { $set: data },
        { new: true }
      )

      if (!user) {
        throw new HttpError(404, "User Not Found");
      }

      await scheduleBirthday(user)

      return {
        id: user._id,
        name: user.name,
        email: user.email,
        birthday: user.birthday,
        timezone: user.timezone
      };
    }

    /**
     * Soft delete user by ID
     * @param {string} id - User ID (MongoDB ObjectId)
     * @throws {HttpError} 404 if user not found
     */
    async deleteUser(id) {
        const user = await Users.findOneAndUpdate(
          {
            _id: id,
            isDeleted: { $ne: true }
          },
          {
            $set: {
              deletedAt: new Date(),
              isDeleted: true
            }
          },
          { new: true }
        );

        if (!user) {
          throw new HttpError(404, "User Not Found");
        }

        await agenda.cancel({
          name: "send birthday",
          "data.userId": new mongoose.Types.ObjectId(id)
        });

        return {
          message: "User deleted successfully",
          id
        };
    }

    /**
     * Get User by Email
     * @param {string} email - user email
     * @throws {HttpError} 404 if user not found
     */
    async getUserByEmail(email) {
      return Users.findOne({ 
        email: email.toLowerCase(),
        isDeleted: { $ne: true } 
      });
    }
}

module.exports = new UserService ();