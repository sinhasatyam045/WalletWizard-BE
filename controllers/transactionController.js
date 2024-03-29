const transactionModel = require("../models/transactionModel");

const getAllTransaction = async (req, res) => {
  const { userid, frequency, selectedDate, type } = req.body;

  try {
    let transactions;
    let startDate, endDate;
    let query = { userid };

    switch (frequency) {
      case "7":
        startDate = new Date(new Date().setDate(new Date().getDate() - 7));
        endDate = new Date();
        query.date = { $gte: startDate, $lte: endDate };
        break;
      case "30":
        startDate = new Date(new Date().setDate(new Date().getDate() - 30));
        endDate = new Date();
        query.date = { $gte: startDate, $lte: endDate };
        break;
      case "365":
        startDate = new Date(new Date().setDate(new Date().getDate() - 365));
        endDate = new Date();
        query.date = { $gte: startDate, $lte: endDate };
        break;
      case "custom":
        if (selectedDate && selectedDate.length === 2) {
          startDate = new Date(selectedDate[0]);
          endDate = new Date(selectedDate[1]);
          query.date = { $gte: startDate, $lte: endDate };
        } else {
          return res.status(400).json({ error: "Invalid custom date range" });
        }
        break;
      default:
        return res.status(400).json({ error: "Invalid frequency value" });
    }

    if (type === "income") {
      query.type = "income";
    } else if (type === "expense") {
      query.type = "expense";
    }

    transactions = await transactionModel.find(query);

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const addTransaction = async (req, res) => {
  try {
    const newTransaction = new transactionModel(req.body);
    console.log("NewTransaction", newTransaction);
    await newTransaction.save();
    res.status(201).send("Transaction created");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const deleteTransaction = async (req, res) => {
  const { _id } = req.body;

  try {
    await transactionModel.findByIdAndDelete(_id);
    res.status(200).send("Deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const editTransaction = async (req, res) => {
  console.log("Request", req.body);
  try {
    const { _id, ...updateData } = req.body;
    const updatedTransaction = await transactionModel.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );
    console.log("Updated Transaction", updatedTransaction);
    res.status(200).send("Edited successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  getAllTransaction,
  addTransaction,
  editTransaction,
  deleteTransaction,
};
