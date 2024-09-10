import React, { useRef, useState } from "react";
import { IonAvatar, IonBackButton, IonButtons, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, IonCol, IonButton, IonFooter } from "@ionic/react";
import { camera } from "ionicons/icons";
import './EditProfile.css';

const EditProfile: React.FC = () => {
    const [avatarSrc, setAvatarSrc] = useState<string>("https://www.gravatar.com/avatar?d=mp");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarSrc(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Edit Profile</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonGrid className="profile-grid">
                    <IonRow className="ion-justify-content-center ion-align-items-center">
                        <IonCol size="auto">
                            <IonAvatar className="edit-profile-avatar" onClick={handleAvatarClick}>
                                <img src={avatarSrc} alt="Avatar" />
                                <IonButton className="edit-avatar-button" fill="clear">
                                    <IonIcon icon={camera} size="large" />
                                </IonButton>
                            </IonAvatar>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </IonCol>
                    </IonRow>
                    <IonItem>
                        <IonLabel position="stacked">ID</IonLabel>
                        <IonInput value="JD12345" disabled />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Name</IonLabel>
                        <IonInput value="John Doe" />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Block Number</IonLabel>
                        <IonInput value="Block-B" disabled />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Flat Number</IonLabel>
                        <IonInput value="101" disabled />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Phone Number</IonLabel>
                        <IonInput value="+123 456 7890" type="tel" />
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Email</IonLabel>
                        <IonInput value="john@gmail.com" type="email" disabled />
                    </IonItem>
                </IonGrid>
            </IonContent>
            <IonFooter className="custom-footer">
                <IonButton expand="full" style={{ padding: "20px" }}>
                    Save
                </IonButton>
            </IonFooter>
        </IonPage>
    );
};

export default EditProfile;
