import React, { useState } from 'react';
import { IonBackButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar, IonLabel, IonItem, IonChip, IonText } from "@ionic/react";
import { add } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import './GetHelp.css'; // Import the CSS file

const GetHelp: React.FC = () => {
    const history = useHistory();
    const [selectedTab, setSelectedTab] = useState<string>('Personal');

    const handleFabClick = () => {
        history.push('/createTicket');
    };

    const handleSegmentChange = (event: CustomEvent) => {
        const value = event.detail.value as string;
        setSelectedTab(value);
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Get Help</IonTitle>
                </IonToolbar>
                <IonToolbar>
                    <IonSegment value={selectedTab} onIonChange={handleSegmentChange}>
                        <IonSegmentButton value="Personal">
                            <IonLabel>Personal</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="Community">
                            <IonLabel>Community</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                {selectedTab === 'Personal' && (
                    <IonItem className="custom-item">
                        <IonLabel className="item-content">
                            <div>
                                <h2>General Inquiry</h2>
                                <p>4th Sep, 2024</p>
                                <IonText>Society Management - Detailed description of the inquiry goes here.</IonText>
                                <p>by Block-A,404</p>
                            </div>
                        </IonLabel>
                        <IonChip class="status-chip" color="primary">
                            <IonLabel>Status</IonLabel>
                        </IonChip>
                    </IonItem>


                )}
                {selectedTab === 'Community' && (
                    <IonItem className="custom-item">
                        <IonLabel className="item-content">
                            <div>
                                <h2>General Inquiry</h2>
                                <p>4th Sep, 2025</p>
                                <IonText>Society Management - Detailed description of the inquiry goes here.</IonText>
                                <p>by Block-A,404</p>
                            </div>
                        </IonLabel>
                        <IonChip class="status-chip" color="primary">
                            <IonLabel>Status</IonLabel>
                        </IonChip>
                    </IonItem>

                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton className="custom-fab-button" onClick={handleFabClick}>
                        <IonIcon icon={add}></IonIcon>
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
}

export default GetHelp;
