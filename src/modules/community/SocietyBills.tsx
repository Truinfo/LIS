import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react"

const SocietyBills: React.FC = () => {

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton />
                    </IonButtons>
                    <IonTitle>Society Bills</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
            </IonContent>
        </IonPage>
    )
}

export default SocietyBills;