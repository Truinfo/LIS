import React, { useState } from "react";
import {
    IonBackButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonImg,
    IonPage,
    IonTitle,
    IonToolbar,
    IonText,
    IonItem,
    IonPopover,
    IonList,
    IonListHeader,
    IonLabel,
    IonButton,
    IonIcon
} from "@ionic/react";
import image1 from "../../assets/Images/image1.jpg";
import "./NoticeBoard.css";
import { chevronDown, chevronUp } from "ionicons/icons";

const events = [
    {
        id: 1,
        title: "Celebrating Ganesh Chaturthi",
        postedDate: "Sep 03, 2024",
        image: image1,
        date: "2024-09-07",
        time: "6:00 PM - 10:00 PM",
        location: "Community Hall, Main Street",
        description: "Join us in celebrating Ganesh Chaturthi with festive decorations, music, dance, and traditional sweets. Everyone is welcome to participate in the celebrations and enjoy the festive spirit.",
        highlights: [
            "Decorations and Lights",
            "Traditional Music and Dance",
            "Special Prayers and Offerings",
            "Delicious Festive Snacks"
        ],
        message: "We look forward to seeing you there!"
    },
    {
        id: 2,
        title: "Society Meeting",
        postedDate: "Sep 02, 2024",
        image: "",
        date: "2024-09-15",
        time: "4:00 PM - 6:00 PM",
        location: "Society Community Hall, Main Street",
        description: "Discuss accounts and management issues concerning the society. Your presence is crucial to address these matters effectively.",
        highlights: [
            "Review of Current Accounts",
            "Management Issues and Updates",
            "Open Discussion and Feedback",
            "Future Plans and Suggestions"
        ],
        message: "We encourage all residents to attend and contribute to the discussion. Your input is valuable for the betterment of our community"
    },
    {
        id: 3,
        title: "Society Meeting",
        postedDate: "Sep 02, 2024",
        image: "",
        date: "2024-09-17",
        time: "4:00 PM - 6:00 PM",
        location: "Society Community Hall, Main Street",
        description: "Discuss accounts and management issues concerning the society. Your presence is crucial to address these matters effectively.",
        highlights: [
            "Review of Current Accounts",
            "Management Issues and Updates",
            "Open Discussion and Feedback",
            "Future Plans and Suggestions"
        ],
        message: "We encourage all residents to attend and contribute to the discussion. Your input is valuable for the betterment of our community"
    }
];

const NoticeBoard: React.FC = () => {
    const [showDetails, setShowDetails] = useState<number | null>(null);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
    const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const latestDate = new Date(Math.max(...events.map(event => new Date(event.date).getTime()))).toISOString().split('T')[0];

    const filteredEvents = (() => {
        switch (selectedFilter) {
            case 'latest':
                return events.filter(event => event.date === latestDate);
            case 'today':
                return events.filter(event => event.date === today);
            case 'thisMonth':
                return events.filter(event => new Date(event.date) >= new Date(startOfMonth));
            default:
                return events;
        }
    })();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Notice Board</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <div className="filter-container">
                    <IonButton
                        id="cover-trigger"
                        fill="outline"
                        className="select-button"
                        onClick={() => setPopoverOpen(prev => !prev)} //
                    >
                        Select Filter
                        <IonIcon icon={popoverOpen ? chevronUp : chevronDown} slot="end" />
                    </IonButton>
                    <IonPopover
                        isOpen={popoverOpen}
                        onDidDismiss={() => setPopoverOpen(false)}
                        trigger="cover-trigger"
                        size="cover"
                        triggerAction="click"
                    >
                        <IonContent>
                            <IonItem button onClick={() => { setSelectedFilter(""); setPopoverOpen(false); }}>
                                <IonLabel>All</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => { setSelectedFilter("latest"); setPopoverOpen(false); }}>
                                <IonLabel>Latest</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => { setSelectedFilter("today"); setPopoverOpen(false); }}>
                                <IonLabel>Today</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => { setSelectedFilter("thisMonth"); setPopoverOpen(false); }}>
                                <IonLabel>This Month</IonLabel>
                            </IonItem>
                        </IonContent>
                    </IonPopover>
                </div>

                {filteredEvents.map(event => (
                    <IonCard key={event.id}>
                        {event.image && <IonImg alt="Event Image" src={event.image} />}
                        <IonCardHeader>
                            <IonCardTitle className="Event-title">{event.title}</IonCardTitle>
                            <IonCardSubtitle>{event.postedDate}</IonCardSubtitle>

                            {showDetails !== event.id && (<IonCardSubtitle><strong>Description:</strong> {event.description}</IonCardSubtitle>
                            )}
                            {showDetails === event.id ? (
                                <>
                                    <IonCardSubtitle>
                                        <p><strong>Date:</strong> {event.date}</p>
                                        <p><strong>Time:</strong> {event.time}</p>
                                        <p><strong>Location:</strong> {event.location}</p>
                                        <p><strong>Description:</strong> {event.description}</p>
                                        <p><strong>Highlights:</strong></p>
                                        <ul>
                                            {event.highlights.map((highlight, index) => (
                                                <li key={index}>{highlight}</li>
                                            ))}
                                        </ul>
                                    </IonCardSubtitle>
                                    <IonCardSubtitle onClick={() => setShowDetails(showDetails === event.id ? null : event.id)}>
                                        Show Less
                                    </IonCardSubtitle>
                                </>
                            ) : (
                                <IonCardSubtitle onClick={() => setShowDetails(showDetails === event.id ? null : event.id)}>
                                    More Details...
                                </IonCardSubtitle>
                            )}
                        </IonCardHeader>
                        {showDetails === event.id && (
                            <IonCardContent>
                                <IonText>
                                    <p>{event.message}</p>
                                </IonText>
                            </IonCardContent>
                        )}
                    </IonCard>

                ))}
            </IonContent>
        </IonPage>
    );
};

export default NoticeBoard;
