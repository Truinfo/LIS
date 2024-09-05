import React from 'react';
import {
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonChip,
    IonContent,
    IonHeader,
    IonImg,
    IonLabel,
    IonPage,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import image from "../../assets/Images/1.jpg"; // Adjust path as needed
import swimming from "../../assets/Images/swimming.jpg"; // Adjust path as needed
import gym from "../../assets/Images/gym.jpg"; // Adjust path as needed
import "./Amenities.css";
import { useHistory } from 'react-router';

const cardData = [
    {
        id: 1,
        title: "Swimming Pool",
        subtitle1: "Timings: 10:00 AM - 6:00 PM",
        subtitle2: "Location: North Side of the Block A in the Society",
        image: swimming,
        chipLabel: "Free"
    },
    {
        id: 2,
        title: "Gym",
        subtitle1: "Timings: 6:00 AM - 10:00 PM",
        subtitle2: "Location: Block B, Ground Floor",
        image: gym,
        chipLabel: "Free"
    },
    {
        id: 3,
        title: "Community Hall",
        subtitle1: "Timings: 6:00 AM - 10:00 PM",
        subtitle2: "Location: Block B, Ground Floor",
        image: image,
        chipLabel: "Paid"
    },
];

const Amenities: React.FC = () => {
    const history = useHistory();

    const handleCardClick = (chipLabel: string) => {
        if (chipLabel === "Paid") {
            history.push(`/bookAmenity`);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Amenities</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {cardData.map(card => (
                    <IonCard
                        key={card.id}
                        onClick={() => handleCardClick(card.chipLabel)}
                        className={card.chipLabel === "Paid" ? "clickable" : ""}
                    >
                        <IonImg alt={card.title} src={card.image} />
                        <IonCardHeader className="header-container">
                            <IonCardTitle>{card.title}</IonCardTitle>
                            <IonCardSubtitle>{card.subtitle1}</IonCardSubtitle>
                            <IonCardSubtitle>{card.subtitle2}</IonCardSubtitle>
                            <IonChip className="book-chip" color="primary">
                                <IonLabel>{card.chipLabel}</IonLabel>
                            </IonChip>
                        </IonCardHeader>
                    </IonCard>
                ))}
            </IonContent>
        </IonPage>
    );
}

export default Amenities;
