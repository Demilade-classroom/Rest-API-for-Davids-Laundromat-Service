const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const routes = require('../constants/routesGroup');
const models = require('../models/index');
const Staff = models.Staff;

exports.verifyToken = (req, res, next) => {
	//check if the token is needed for the route being accessed
	if (!routes.unsecureRoutes.includes(req.path)) {
		const authHeader = req.headers['authorization'];
		let token;

		if (!authHeader) {
			return res.status(412).json({
				message: 'Access denied!!! Missing credentials',
			});
		}

		//separate the Bearer from the string if it exists
		const separateBearer = authHeader.split(' ');
		if (separateBearer.includes('Bearer')) {
			token = separateBearer[1];
		} else {
			token = authHeader;
		}

		try {
			const grantAccess = jwt.verify(token, config.SECRET_TOKEN);
			req.staff = grantAccess;
			next();
			return;
		} catch (error) {
			console.log(`JWT verification error >>> ${error.message}`);
			res.status(403).json({
				message: 'Something went wrong. Please try again..',
			});
		}
	} else {
		next();
	}
};

exports.checkStaff = (req, res, next) => {
	if (req.staff) {
		const staffId = req.staff._id;
		try {
			//check if the staff making the request is still a registered staff
			Staff.findById(staffId)
				.then((registeredStaff) => {
					if (!registeredStaff) {
						return res
							.status(401)
							.json({ message: 'Sorry, you do not have access to this route' });
					} else {
						next();
					}
				})
				.catch((err) => {
					return res.status(500).json({
						message: err.message,
					});
				});
		} catch (error) {
			return res.status(500).json({
				message: 'error',
				error: error.message,
			});
		}
	} else {
		next();
	}
};
