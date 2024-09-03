import { IonBackButton, IonButtons, IonContent,  IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";


const AddForum: React.FC = () => {
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Add Forum</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                
            </IonContent>
        </IonPage>
    );
}

export default AddForum;
