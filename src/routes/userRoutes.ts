import { Router } from 'express';
import { UserController } from '../controllers/UserController';

const router = Router();

// User routes
router.post('/users', UserController.createUser);
router.get('/users', UserController.getAllUsers);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// RSVP routes
router.get('/users/:id/rsvp', UserController.getRSVPStatus);
router.put('/users/:id/rsvp', UserController.updateRSVPStatus);

export default router;

