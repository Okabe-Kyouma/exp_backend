const MoneySource = require('../models/MoneySource');
const User = require('../models/User');

exports.addMoneySource = async (req, res) => {
  try {
    const { source, amount } = req.body;
    if (!source || typeof amount !== 'number') {
      return res.status(400).json({ message: 'Source and amount required' });
    }
    // Add source to user's sourcesEnum if not present
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.sourcesEnum.includes(source)) {
      user.sourcesEnum.push(source);
      await user.save();
    }
    const newSource = new MoneySource({
      user: req.user.userId,
      source,
      amount
    });
    await newSource.save();
    res.status(201).json(newSource);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteMoneySource = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await MoneySource.findOneAndDelete({ _id: id, user: req.user.userId });
    if (!deleted) {
      return res.status(404).json({ message: 'Money source not found' });
    }
    res.json({ message: 'Money source deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.editMoneySource = async (req, res) => {
  try {
    const { id } = req.params;
    const { source, amount } = req.body;
    const moneySource = await MoneySource.findOne({ _id: id, user: req.user.userId });
    if (!moneySource) {
      return res.status(404).json({ message: 'Money source not found' });
    }
    let sourceChanged = false;
    if (source && source !== moneySource.source) {
      // Update sourcesEnum: remove old, add new
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.sourcesEnum = user.sourcesEnum.filter(s => s !== moneySource.source);
      if (!user.sourcesEnum.includes(source)) {
        user.sourcesEnum.push(source);
      }
      await user.save();
      moneySource.source = source;
      sourceChanged = true;
    }
    if (typeof amount === 'number') {
      moneySource.amount = amount;
    }
    await moneySource.save();
    res.json({ message: 'Money source updated', moneySource, sourceChanged });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getTotalAmount = async (req, res) => {
  try {
    const sources = await MoneySource.find({ user: req.user.userId });
    const total = sources.reduce((sum, src) => sum + src.amount, 0);
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.listMoneySources = async (req, res) => {
  try {
    const sources = await MoneySource.find({ user: req.user.userId });
    res.json(sources);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 