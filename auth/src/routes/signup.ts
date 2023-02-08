import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { User } from '../models/user';
import jwt from 'jsonwebtoken';
import {
	RequestValidationError,
	BadRequestError,
	validateRequest,
} from '@jeffliunpm/common';

const router = express.Router();

router.post(
	'/api/users/signup',
	[
		body('email').isEmail().withMessage('email must be valid'),
		body('password')
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage('Password must between 4 to 20 characters'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new BadRequestError('Email in use');
		} else {
			const user = User.build({ email, password });
			await user.save();

			//jwt save in session
			const userJwt = jwt.sign(
				{
					id: user.id,
					email: user.email,
				},
				process.env.JWT_KEY!
			);

			req.session = { jwt: userJwt };
			return res.status(201).send(user);
		}
	}
);

export { router as signupRouter };
