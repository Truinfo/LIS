import { IonBackButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { add } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import './GetHelp.css'; // Import the CSS file

const GetHelp: React.FC = () => {
    const history = useHistory();

    const handleFabClick = () => {
        history.push('/addforum');
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
            </IonHeader>
            <IonContent fullscreen>
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
