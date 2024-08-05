const express = require('express');
const { candidatesignUp, updateCandidate, deleteCandidate, voteCandidate, voteCount } = require('../controllers/candidateControllers');
const { jwtAuthMiddleware } = require('../middlewares/jwt');
const router = express.Router();

router.post('/signup', jwtAuthMiddleware , candidatesignUp);
router.put('/update/:candidateID', jwtAuthMiddleware , updateCandidate);
router.delete('/delete/:candidateID', jwtAuthMiddleware , deleteCandidate);
router.post('/vote/:candidateID', jwtAuthMiddleware , voteCandidate);
router.get('/vote/count', voteCount);

module.exports = router;