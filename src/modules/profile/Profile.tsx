import { IonAvatar, IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import './Profile.css';
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
                <div className="profile-container">
                    <IonAvatar className="profile-avatar">
                        <img src="https://www.gravatar.com/avatar?d=mp" alt="Avatar" />
                    </IonAvatar>
                    <div className="profile-details">
                        <h2>John Doe</h2>
                        <p>+123 456 7890</p>
                        <p>john@gmail.com</p>
                        <p>Block-B,Flat No-101</p>
                    </div>
                </div>

            </IonContent>
        </IonPage>
    );
}
export default Profile;