const mongoose = require('mongoose');

const runInTransaction = async (mutations) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const value = await mutations(session);
    await session.commitTransaction();
    return value;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = runInTransaction;
