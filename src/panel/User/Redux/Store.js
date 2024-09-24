import { configureStore } from '@reduxjs/toolkit';
import serviceReducer from './Slice/ServiceSlice/ServiceSlice';
import noticeReducer from './Slice/Security_Panel/NoticeSlice';
import userLoginReducer from './Slice/AuthSlice/Login/LoginSlice';
import profileReducer from './Slice/ProfileSlice/ProfileSlice';
import profileEditReducer from './Slice/ProfileSlice/EditProfileSlice';
import emergencyContactsReducer from './Slice/CommunitySlice/EmergencyContactSlice';
import emailVerificationReducer from './Slice/AuthSlice/Signup/SendEmailVerification';
import cityReducer from './Slice/AuthSlice/Signup/citySlice';
import societiesReducer from './Slice/AuthSlice/Signup/societySlice';
import otpReducer from './Slice/AuthSlice/Signup/otpSlice';
import userProfileReducer from './Slice/AuthSlice/Signup/userProfileSlice';
import forgotPasswordEmailReducer from './Slice/AuthSlice/Forgot/SendForgotEmail';
import forgotOtpReducer from './Slice/AuthSlice/Forgot/forgotOtpSlice';
import resetPasswordReducer from './Slice/AuthSlice/Forgot/resetPasswordSlice';
import userResetPasswordReducer from './Slice/ProfileSlice/resetSlice';
import visitorReducer from './Slice/Security_Panel/VisitorsSlice';
import visitorsReducer from './Slice/Security_Panel/InandOutSlice';
import frequentVisitorsReducer from './Slice/Security_Panel/FrequentVisitorsSlice';

import houseHoldsReducer from './Slice/ProfileSlice/Household/AddMemberSlice';
import vehicleReducer from './Slice/ProfileSlice/Household/VehicleSlice';
import petReducer from './Slice/ProfileSlice/Household/PetSlice';
import frequentVisitorsuserReducer from "./Slice/ProfileSlice/Household/frequentVisitorsSlice"
import residentsuserReducer from './Slice/CommunitySlice/residentsSlice';
import securityReducer from './Slice/QuickActionsSlice/SecuiritySlice';
import eventsReducer from './Slice/CommunitySlice/EventSlice';
import preApprovalReducer from './Slice/Home/PreapprovalSlice';
import manageserviceReducer from './Slice/ProfileSlice/manageServiceSlice';
import addServiceSlice from './Slice/ServiceSlice/AddServiceSlice';
import SocietyByIdReducer from './Slice/Security_Panel/SocietyByIdSlice';
import notificationReducer from './Slice/NotificationSlice/NotificationSlice';
import BookingReducer from './Slice/ProfileSlice/MyBookingSlice';

import HomeScreen from './Slice/Security_Panel/HomeScreenSlice';
import DenyEntry from './Slice/Security_Panel/DenySlice';
import checkOut from './Slice/Security_Panel/CheckOutSlice';
import Settings from './Slice/Security_Panel/SettingsSlice';
import quickContacts from './Slice/Security_Panel/QuickContactsSlice';
import staffVisitors from './Slice/Security_Panel/StaffInandOutSlice';
import billsReducer from './Slice//ProfileSlice/myBillsSlice';
import societyLicence from './Slice/AuthSlice/Signup/licenceSlice';
import societyBillReducer from './Slice/CommunitySlice/SocietyBillsSlice'
import rentalReducer from './Slice/CommunitySlice/Rental/rentalSlice'

import complaintsReducer from './Slice/GetHelpSlice/ComplaintsSlice';
import AmenitiesReducer from './Slice/CommunitySlice/Amenities';
import GetDocumentSlice from './Slice/ProfileSlice/GetDocumentSlice';
import DocumentSlice from './Slice/ProfileSlice/DocumentSlice';
<<<<<<< HEAD
import { GateKeeperReducer } from '../../admin/pages/Security/GateKeeperSlice';


=======
import { AdvertisementReducer } from '../../admin/pages/Advertisements/AdvertisementSlice';



//admin
>>>>>>> 83cfd3372e333883a36091a8d2ba6e79e399c66d

const store = configureStore({
  reducer: {
    //Services
    services: serviceReducer,
    addService: addServiceSlice,
    userLogin: userLoginReducer,
    senEmailforgotPassword: forgotPasswordEmailReducer,
    forgototp: forgotOtpReducer,
    resetPassword: resetPasswordReducer,
    userResetPassword: userResetPasswordReducer,
    //Auth //Signup
    citiesState: cityReducer,
    societiesState: societiesReducer,
    emailVerification: emailVerificationReducer,
    otp: otpReducer,
    user: userProfileReducer,
    //Profile
    profiles: profileReducer,
    profileEdit: profileEditReducer,
    manageServices: manageserviceReducer,
    mybills: billsReducer,
    myBookings: BookingReducer,
    amenities: AmenitiesReducer,
    documentGetted: GetDocumentSlice,
    document: DocumentSlice,
    //Profile//Households
    frequentVisitor: frequentVisitorsuserReducer,
    houseHolds: houseHoldsReducer,
    vehicle: vehicleReducer,
    pet: petReducer,
    //Community
    emergencyContacts: emergencyContactsReducer,
    notices: noticeReducer,
    userResidents: residentsuserReducer,
    events: eventsReducer,
    societyBills: societyBillReducer,
    rental: rentalReducer,
    //Home
    preApprovals: preApprovalReducer,
    //Quick Actions
    security: securityReducer,
    //GetHelp
    complaints: complaintsReducer,
    //Notifications
    notification: notificationReducer,
    visitor: visitorReducer,
    visitors: visitorsReducer,
    frequentVisitors: frequentVisitorsReducer,
    societyById: SocietyByIdReducer,
    homeScreen: HomeScreen,
    dening: DenyEntry,
    checkOuting: checkOut,
    setting: Settings,
    quickContact: quickContacts,
    staffVisitor: staffVisitors,
    societyLis: societyLicence,

<<<<<<< HEAD
    gateKeepers: GateKeeperReducer,
=======

    //admin

   

>>>>>>> 83cfd3372e333883a36091a8d2ba6e79e399c66d
  },
});
export default store;
