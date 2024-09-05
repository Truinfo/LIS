import React, { useState } from 'react';
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonChip,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonLabel,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar,
    IonModal,
    IonInput,
    IonItem,
    IonList,
    IonTextarea,
    IonAlert,
    IonDatetime,
    IonDatetimeButton
} from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';
import '@ionic/react/css/ionic-swiper.css';
import './BookingAmenity.css';

import image1 from '../../assets/Images/1.jpg';
import image2 from '../../assets/Images/2.jpg';
import image3 from '../../assets/Images/3.jpg';
import { call } from 'ionicons/icons';

const BookingAmenity: React.FC = () => {
    const [showModal, setShowModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showDateTimeModal, setShowDateTimeModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);

    const handleBookClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleConfirmBooking = () => {
        setShowAlert(true);
        setShowModal(false);
    };

    const handleOpenDateTimeModal = () => {
        setShowDateTimeModal(true);
    };

    const handleCloseDateTimeModal = () => {
        setShowDateTimeModal(false);
    };

    const handleDateTimeConfirm = () => {
        setShowDateTimeModal(false);
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Book Amenity</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen className="ion-content">
                <Swiper
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    keyboard={true}
                    pagination={{ clickable: true }}
                    scrollbar={{ draggable: true }}
                    zoom={true}
                    className="swiper-container"
                >
                    <SwiperSlide>
                        <img src={image1} alt="Slide 1" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={image2} alt="Slide 2" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={image3} alt="Slide 3" />
                    </SwiperSlide>
                </Swiper>
                <div className="info-container">
                    <IonTitle className="info-title">Community Hall</IonTitle>
                    <IonChip className="chip">Book</IonChip>
                    <IonText className="info-text">
                        <p>Capacity: 100-150 Members</p>
                        <p>Timings: 10:00 AM - 10:00 PM</p>
                        <p>Location: South of the Block A inside the Society</p>
                    </IonText>
                    <IonTitle className="Amount">3000/-</IonTitle>
                </div>
                <div className="contact-info">
                    <IonTitle className="contact-title">Any Queries?</IonTitle>
                    <IonTitle>
                        <p>Please Contact below Number</p>
                        <p className="contact-number">
                            <IonIcon icon={call} className="phone-icon" />
                            <a href="tel:+918912345670">+91 8912345670</a>
                        </p>
                    </IonTitle>
                </div>
            </IonContent>
            <IonFooter className='custom-footer'>
                <IonButton className="book-button" expand="full" onClick={handleBookClick}>
                    Book
                </IonButton>
            </IonFooter>
            <IonModal
                isOpen={showModal}
                onDidDismiss={handleCloseModal}
                initialBreakpoint={0.75}
                breakpoints={[0, 0.25, 0.5, 0.75]}
                backdropDismiss={false}
                className="custom-modal"
            >
                <IonHeader className='custom-footer'>
                    <IonToolbar>
                        <IonTitle>Booking Form</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={handleCloseModal}>Close</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonItem className="ion-item-gap">
                            <IonInput label="Name" labelPlacement="floating" fill="solid" type="text" />
                        </IonItem>
                        <IonItem className="ion-item-gap">
                            <IonInput label="Phone Number" labelPlacement="floating" fill="solid" type="tel" />
                        </IonItem>
                        <IonItem className="ion-item-gap">
                            <IonInput label="Event Name" labelPlacement="floating" fill="solid" type="text" />
                        </IonItem>
                        <IonTitle className="datetime-label">Select Date and Time</IonTitle>
                        <IonItem className="datetime-container">
                            <IonDatetimeButton datetime="datetime" />
                        </IonItem>
                        <IonModal keepContentsMounted={true} className="custom-modal">
                            <IonDatetime
                                id="datetime"
                                presentation="date-time"
                                formatOptions={{
                                    date: {
                                        weekday: 'short',
                                        month: 'long',
                                        day: '2-digit',
                                    },
                                    time: {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    },
                                }}
                            ></IonDatetime>
                        </IonModal>
                    </IonList>
                    <IonButton expand="full" className="book-button" onClick={handleConfirmBooking}>
                        Confirm Booking
                    </IonButton>
                </IonContent>
            </IonModal>
            <IonAlert
                isOpen={showAlert}
                onDidDismiss={() => setShowAlert(false)}
                header="Booking Confirmed"
                message="Your booking has been confirmed."
                buttons={['OK']}
            />
        </IonPage>
    );
}

export default BookingAmenity;
