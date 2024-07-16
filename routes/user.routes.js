import express from 'express';

import {  isAuthenticated, isUserAuthenticated, isWorkerAuthenticated } from '../middlewares/auth.js';

import { deleteUser, deleteWorker,getParticularAdmin,getParticularUser, getParticularWorker, getUsers, getWorkers, logOut, logOutAdmin, logOutWorker, loginAdmin, loginUser, loginWorker, registerAdmin, registerUser, registerWorker, getParticularWorkerWithoutId } from '../controllers/user.controllers.js';

const router = express.Router();


// User->
router.post('/registerUser',registerUser);
router.post(`/loginUser`,loginUser);
router.get(`/logoutUser`,isUserAuthenticated,logOut);
router.delete('/deleteUser',isUserAuthenticated,deleteUser)
router.get('/getUsers',isAuthenticated,getUsers);
router.get(`/userProfile`,isUserAuthenticated,getParticularUser);




// ADMIN->
router.post('/registerAdmin',isAuthenticated,registerAdmin);
router.post('/loginAdmin',loginAdmin);
router.get('/logoutAdmin',isAuthenticated,logOutAdmin);
router.get('/adminProfile',isAuthenticated,getParticularAdmin)






// WORKER->
router.post('/registerWorker',isAuthenticated,registerWorker);
router.post(`/loginWorker`,loginWorker);
router.get(`/logoutWorker`,isWorkerAuthenticated,logOutWorker);
router.delete('/deleteWorker',isWorkerAuthenticated,deleteWorker)
router.get('/getWorkers',getWorkers);
router.get('/getParticularWorker/:id',getParticularWorker);
router.get(`/workerProfile`,isWorkerAuthenticated,getParticularWorkerWithoutId);



export default router;



// "name":"worker1",
// "email":"worker1@gmail.com",
// "password":"12345678",
// "phone":"1234567890",
// "gender":"Male",
// "address":"1234",
// "occupation":"Barber",
// "salary":"7KperHour",
// "available":"available"