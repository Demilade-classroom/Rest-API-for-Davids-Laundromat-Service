const customerRoutes = require('express').Router();
const { check, body } = require('express-validator');
const Customer = require('../models/index').Customer;

//controllers
const {
	register,
	getAll,
	getOne,
	updateOne,
	deleteOne,
	deleteAll,
} = require('../controller/customer');

const validateCustomer = [
	check('customer_name', "Customer's name is empty").notEmpty(),
	check('email', 'Email is invalid or empty').isEmail(),
	check('mobile_num')
		.isLength({ min: 10, max: 15 })
		.withMessage('Mobile Number must between 10 to 15 characters long')
		.matches(/^[+-\d]+$/)
		.withMessage('Mobile Number must be a valid Nigerian number'),
	check('address', 'Address is empty').notEmpty(),
	body('email').custom((value) => {
		return Customer.findOne({ email: value }).then((customer) => {
			if (customer) {
				return Promise.reject(
					'Customer with the same email as been registered... try another email or update existing customer'
				);
			}
		});
	}),
];

//register a new customer
customerRoutes.post('/register', validateCustomer, register);

//get all the customers
customerRoutes.get('/all', getAll);

//get customer by id
customerRoutes.get('/:id', getOne);

//update customer by id
customerRoutes.put('/:id', updateOne);

//delete customer by id
customerRoutes.delete('/:id', deleteOne);

//delete all customers
customerRoutes.delete('/delete/all', deleteAll);

module.exports = customerRoutes;
