import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import DistributedItem from '../models/DistributedItem.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/create', auth, async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const agent = new User({
      name,
      email,
      mobile,
      password: hashedPassword,
      role: 'agent',
    });
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    console.error('Error creating agent:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/usersList',auth,async (req,res) => {
  try {
    const agents= await User.find({role:'agent'});
    console.log(agents);
    res.json(agents);
  }catch (error){
    res.status(500).json({error:'Failed to fetch Agents.'});
  }
}
)

router.get('/list/:userId', auth, async (req, res) => {
  const { userId } = req.params;
  try {
    const items = await DistributedItem.find({ agentId: userId });
    if (items.length === 0) {
      return res.status(404).json({ error: 'No distributed items found for this agent.' });
    }
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch distributed items.' });
  }
});

// Update agent details
router.put('/update/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;

  try {
    // Check if the email is already used by another agent (exclude current agent)
    const existingUser = await User.findOne({ email, _id: { $ne: id } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use by another agent' });
    }

    // Find the agent by id and update
    const updatedAgent = await User.findByIdAndUpdate(
      id,
      { name, email, mobile },
      { new: true, runValidators: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.json(updatedAgent);
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/delete/:id', auth, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAgent = await User.findOneAndDelete({ _id: id, role: 'agent' });

    if (!deletedAgent) {
      return res.status(404).json({ message: 'Agent not found or already deleted' });
    }

    res.json({ message: 'Agent deleted successfully' });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
