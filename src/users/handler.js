const router = require('express').Router();
const mongoose = require('mongoose')
const { HttpError } = require('../lib/error');
const { createUserSchema, updateUserSchema } = require('./validator');

const service = require('./service');

router.post('/', async (req, res, next) => {
  try{
    const { error } = createUserSchema.validate(req.body);
    if (error) throw new HttpError(400, error.message)
    const user = await service.createUser(req.body);
    return res.status(201).json(user); 
  }catch(err){
    next(err)
  }
});

router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params
    
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new HttpError(400, "Invalid User ID");
  }

  const user = await service.getUserById(user_id);
  return res.status(200).json(user);
});

router.patch('/:user_id', async (req, res) => {
  const { user_id } = req.params
  
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new HttpError(400, "Invalid User ID");
  }
  
  if (!req.body || typeof req.body !== 'object') {
    throw new HttpError(400, "Request body is required");
  }
  const { error } = updateUserSchema.validate(req.body);
  
  if (error) throw new HttpError(400, error.message)

  const user = await service.updateUser(req.params.user_id, req.body);
  return res.status(200).json(user)
});

router.delete('/:user_id', async (req, res) => {
  const { user_id } = req.params

  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new HttpError(400, "Invalid User ID");
  }

  const user = await service.deleteUser(req.params.user_id);
  return res.status(200).json(user)
});

module.exports = router;