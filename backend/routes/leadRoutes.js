import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats,
} from '../controllers/leadController.js';

const router = express.Router();

router.route('/')
  .get(getLeads)
  .post(createLead);

router.route('/stats')
  .get(getLeadStats);

router.route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

export default router;
