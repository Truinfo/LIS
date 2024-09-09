import { IonAvatar, IonBackButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonLabel, IonPage, IonRouterLink, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import './Profile.css';
import { chevronForward, lockClosed, logOut, pencil, people } from "ionicons/icons";
const Profile: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Profile</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen >
                <IonGrid className="profile-container">
                    <IonAvatar className="profile-avatar">
                        <img src="https://www.gravatar.com/avatar?d=mp" alt="Avatar" />
                    </IonAvatar>
                    <div className="profile-details">
                        <h2>John Doe</h2>
                        <p>Block-B,Flat No-101</p>
                        <p>+123 456 7890</p>
                        <p>john@gmail.com</p>
                    </div>
                </IonGrid>
                <IonRouterLink routerLink="/editProfile">
                    <IonGrid className="profile-list">
                        <IonRow>
                            <IonCol className="icon-label-container">
                                <IonIcon icon={pencil} className="custom-icon" />
                                <IonLabel>Edit Profile</IonLabel>
                            </IonCol>
                            <IonCol className="ion-text-end" size="auto">
                                <IonIcon icon={chevronForward} className="custom-icon" />
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonRouterLink>
                {/* <IonRouterLink routerLink="/resetPassword"> */}
                    <IonGrid className="profile-list">
                        <IonRow>
                            <IonCol className="icon-label-container">
                                <IonIcon icon={people} className="custom-icon" />
                                <IonLabel>Manage HouseHolds</IonLabel>
                            </IonCol>
                            <IonCol className="ion-text-end" size="auto">
                                <IonIcon icon={chevronForward} className="custom-icon" />
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                {/* </IonRouterLink> */}
                <IonRouterLink routerLink="/resetPassword"> 
                    <IonGrid className="profile-list">
                        <IonRow>
                            <IonCol className="icon-label-container">
                                <IonIcon icon={lockClosed} className="custom-icon" />
                                <IonLabel>Reset Password</IonLabel>
                            </IonCol>
                            <IonCol className="ion-text-end" size="auto">
                                <IonIcon icon={chevronForward} className="custom-icon" />
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </IonRouterLink>
                <IonGrid className="profile-list">
                    <IonRow>
                        <IonCol className="icon-label-container">
                            <IonIcon icon={logOut} className="custom-icon" />
                            <IonLabel>Log out</IonLabel>
                        </IonCol>
                        <IonCol className="ion-text-end" size="auto">
                            <IonIcon icon={chevronForward} className="custom-icon" />
                        </IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage >
    );
}
export default Profile;