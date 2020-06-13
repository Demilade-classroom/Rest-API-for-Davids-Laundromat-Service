const models = require('../models/index');
const Customer = models.Customer;
const Staff = models.Staff;
const { validationResult } = require('express-validator');

exports.getAll = async (req, res) => {
	try {
		const customers = await Customer.find()
			.populate('washes', 'washDate washId number_of_wash')
			.populate('payments', 'payment_date amount payment_mode');
		if (customers.length <= 0) {
			return res.status(404).json({
				message: 'No record of customers to display... Register a customer',
			});
		} else {
			return res.status(200).json({
				message: 'Registered customers',
				customers: customers,
			});
		}
	} catch (error) {
		console.log(`Retrieve all customers error >>> ${error.message}`);
		return res.status(500).json({
			message: 'Error in getting customer',
		});
	}
};

exports.register = async (req, res) => {
	const { customer_name, email, mobile_num, address } = req.body;

	const errors = validationResult(req);

	try {
		//get the validation results
		if (!errors.isEmpty()) {
			return res.status(422).json({
				errors: errors.array(),
			});
		}

		const name = customer_name.toLowerCase();
		const user = new Customer({
			customer_name: name,
			email,
			mobile_num,
			address,
		});

		const newCustomer = await user.save();
		res.status(201).json({
			message: 'Successfully created a new Customer',
			customer: newCustomer,
		});
	} catch (error) {
		console.log(`Customer's signup error >>> ${error.message}`);
		res.status(500).json({
			message: 'Error in creating user!',
		});
	}
};

exports.getOne = async (req, res) => {
	const id = req.params.id;

	try {
		const customer = await Customer.findById(id)
			.populate('washes', 'washDate washId')
			.populate('payments', 'payment_date amount payment_mode');

		if (!customer) {
			return res.status(404).json({
				message: 'No customer with such id was found in the database',
			});
		} else {
			return res.status(200).json({
				message: 'Found customer',
				customer,
			});
		}
	} catch (error) {
		console.log(`Retrieve all customer error >>> ${error.message}`);
		return res.status(500).json({
			message: `Error in geting customer's data`,
		});
	}
};

exports.updateOne = async (req, res) => {
	const id = req.params.id;

	try {
		const customer = await Customer.findByIdAndUpdate(id, req.body, {
			new: true,
			useFindAndModify: false,
		});

		if (customer) {
			res.status(200).json({
				Message: `Customer with id - ${id} has been updated successfully!`,
				Customer: customer,
			});
		}
	} catch (error) {
		console.log(`Update customer error >>> ${error.message}`);
		res.status(500).json({
			message: 'Error in updating the user',
		});
	}
};

exports.deleteOne = async (req, res) => {
	const id = req.params.id;
	try {
		const deletedCustomer = await Customer.findByIdAndRemove(id, {
			useFindAndModify: false,
		});

		if (deletedCustomer) {
			res.status(200).json({
				Message: `Customer with id - ${id} has been deleted successfully!`,
			});
		}
	} catch (error) {
		console.log(`Delete customer error >>> ${error.message}`);
		res.status(500).json({
			message: 'Error in deleting the customer',
		});
	}
};

exports.deleteAll = async (req, res) => {
	try {
		const deletedCustomers = await Customer.deleteMany({});

		if (deletedCustomers) {
			res.status(200).json({
				Message: `${deletedCustomers.deletedCount} customer(s) has/have been deleted successfully!`,
			});
		}
	} catch (error) {
		console.log(`Delete customers error >>> ${error.message}`);
		res.status(500).json({
			message: 'Error in deleting the customers',
		});
	}
};
