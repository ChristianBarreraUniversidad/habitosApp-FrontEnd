var express = require('express');
var router = express.Router();
const Habit = require('../models/Habit');
const jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token not provided' });
  }

  try {
    const tokeWithoutBearer = token.replace('Bearer ', '');
    const verified = jwt.verify(tokeWithoutBearer, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ error: 'Invalid token or expired' });
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/habits', authenticateToken, async (req, res) => {
  try{
    let userId  = req.user && req.user.userId ? req.user.userId: res.status(500).json({ message: 'Error retrieving habits' });;
    const habits = await Habit.find({'userId': new mongoose.Types.ObjectId(userId)});
    res.json(habits);
  }catch(err){
    console.error(err);
    res.status(500).json({ message: 'Error retrieving habits' });
  }
});

router.post('/habits', authenticateToken, async (req, res) => {
  try{
    let { title, description} = req.body;
    let userId  = req.user && req.user.userId ? req.user.userId: res.status(500).json({ message: 'Error retrieving habits' });;
    userId =  new mongoose.Types.ObjectId(userId);
    const habit = new Habit({ title, description, userId: new mongoose.Types.ObjectId(userId) });
    await habit.save();
    res.json(habit);
  }catch(err){
    console.error(err);
    res.status(400).json({ message: 'Error creating habit' });
  }
});

router.delete('/habits/:id', authenticateToken, async (req, res) => {
  try {
    let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({ error: 'Error deleting habit' });
    userId = new mongoose.Types.ObjectId(userId);
    await Habit.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ message: 'Habit deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Failed to delete habit' });
  }
});

router.put('/habits/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description } = req.body;
    let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({ error: 'Error updating habit' });
    userId = new mongoose.Types.ObjectId(userId);
    const habit = await Habit.findByIdAndUpdate(req.params.id, { title, description, userId }, { new: true });
    res.json(habit);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Failed to update habit' });
  }
});

router.patch('/habits/markasdone/:id', authenticateToken, async (req, res) => {
  try {
    let userId = req.user && req.user.userId ? req.user.userId : res.status(500).json({ error: 'Error marking habit as done' });
    userId = new mongoose.Types.ObjectId(userId);
    const habit = await Habit.findById(req.params.id);
    if (!habit) {
      return res.status(404).json({ message: 'Habit not found' });
    }
    habit.lastDone = new Date();
    if(timeDifferenceInHours(habit.lastDone, habit.lastUpdate) < 24){
      habit.days = timeDifferenceInDays(habit.lastDone, habit.startedAt);
      habit.lastUpdate = new Date();
      await habit.save(); 
      res.status(200).json({'message': 'Habit marked as done'});
    } else {
      habit.days = 0;
      habit.lastUpdate = new Date();
      habit.startedAt = new Date();
      await habit.save();
      res.status(200).json({'message': 'Habit restarted'});
    }
  } catch(err) {
    console.log(err);
    res.status(500).json({ message: 'Habit not found' });
  }
});

function timeDifferenceInHours(date1, date2) {
  const diffInMs = Math.abs(date1 - date2);
  return diffInMs / (1000 * 60 * 60);
}

function timeDifferenceInDays(date1, date2) {
  const diffInMs = Math.abs(date1 - date2);
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
}


module.exports = router;
